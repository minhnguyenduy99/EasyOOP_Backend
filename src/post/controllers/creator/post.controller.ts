import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import {
    UseFormData,
    Serialize,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
} from "src/lib/helpers";
import {
    IPaginator,
    IResultLimiter,
    PaginatorFactory,
} from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { PostFilterOptions } from "../../helpers";
import {
    CreatePostDTO,
    GetPostsDTO,
    PaginatedPostDTO,
    SortOptions,
} from "../../dtos";
import { PostService } from "../../services";
import { ERRORS, POST_STATUSES } from "src/post/modules/core";
import {
    LimitedPostVerificationDTO,
    PostVerificationService,
    SearchVerificationDTO,
} from "src/post/modules/post-verification";
import {
    VERIFICATION_STATUS,
    VERIFICATION_TYPES,
} from "src/post/modules/post-verification/consts";
import { MockAuthor, MockManager } from "src/post/decorators/mock.decorator";

@Controller("/creator/posts")
@UseInterceptors(ResponseSerializerInterceptor)
export class CreatorPostController {
    protected readonly DEFAULT_PAGE_SIZE = 6;
    protected paginator: IPaginator;
    protected pendingPostLimiter: IResultLimiter;

    constructor(
        private postService: PostService,
        private postVerification: PostVerificationService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "localhost:3000",
            pageSize: this.DEFAULT_PAGE_SIZE,
        });
        this.pendingPostLimiter = paginatorFactory.createLimiter({
            requestURL: "localhost:3000/creator/posts/pending/search",
        });
    }

    @Post()
    @UseFormData({
        fileField: ["content_file", "thumbnail_file"],
        jsonFields: ["tags"],
    })
    async createPost(@Body() dto: CreatePostDTO, @MockAuthor() author: any) {
        const result = await this.postService.createPost(dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        this.postVerification.createVerification({
            type: VERIFICATION_TYPES.CREATED,
            post_id: result.data.post_id,
            author_id: author.author_id,
            post_info: result.data,
        });
        return {
            code: result.code,
            data: result.data.post_id,
        };
    }

    @Serialize(CommonResponse())
    @Put("/:post_id")
    @UseFormData({
        fileField: ["content_file", "thumbnail_file"],
    })
    async updatePost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
        @Body() dto: CreatePostDTO,
        @MockAuthor() author: any,
    ) {
        const result = await this.postService.updatePost(postId, dto);
        if (result["error"]) {
            throw new BadRequestException(result);
        }
        this.postVerification.createVerification({
            type: VERIFICATION_TYPES.UPDATED,
            post_id: result.data.post_id,
            author_id: author.author_id,
            post_info: result.data,
        });
        return {
            code: 0,
            data: result.data.post_id,
        };
    }

    @Serialize(CommonResponse())
    @Put("/pending/:post_id")
    @UseFormData({
        fileField: ["content_file", "thumbnail_file"],
    })
    async updatePendingPost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
        @Body() dto: CreatePostDTO,
    ) {
        const result = await this.postService.updatePendingPost(postId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return {
            code: 0,
            data: result.data.post_id,
        };
    }

    @Delete("/:post_id")
    async deletePost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
        @MockAuthor() author: any,
    ) {
        const result = await this.postService.deletePost(postId);
        if (result["error"]) {
            if (result.code === ERRORS.ServiceError.code) {
                throw new InternalServerErrorException(ERRORS.ServiceError);
            }
            throw new BadRequestException(result);
        }
        this.postVerification.createVerification({
            type: VERIFICATION_TYPES.DELETED,
            post_id: postId,
            author_id: author.author_id,
        });
        return result;
    }

    @Get("/search/:page")
    @Serialize(PaginatedPostDTO)
    async getPosts(
        @Param("page", ParseIntPipe) page: number,
        @Query(QueryValidationPipe) searchOptions: GetPostsDTO,
    ) {
        const {
            search,
            sort_by,
            sort_order,
            post_status,
            topic_id,
        } = searchOptions;
        const limit = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        const filter = {
            keyword: search,
            topic_id,
            post_status,
        } as PostFilterOptions;
        const sorter = {
            field: sort_by,
            asc: sort_order === "asc" ? true : false,
        } as SortOptions;
        const { results, count } = await this.postService.getPosts(
            filter,
            limit,
            sorter,
        );
        const paginatedResults = await this.paginator.paginate(results, count, {
            page,
            additionQuery: searchOptions,
        });
        return paginatedResults;
    }

    @Get("/pending/search")
    @Serialize(LimitedPostVerificationDTO)
    async getPendingPosts(
        @Query(QueryValidationPipe) query: SearchVerificationDTO,
        @Query("group", ParseBoolPipe) group = false,
        @MockAuthor() author: any,
    ) {
        const status = query.status;
        let getActivePost = true;
        if (status !== VERIFICATION_STATUS.VERIFIED) {
            getActivePost = false;
        }
        const [{ count, results }, groupResult] = await Promise.all([
            this.postVerification.findVerifications(query, {
                authorId: author.author_id,
                groups: [
                    {
                        type: "post",
                        options: {
                            metadata: true,
                            topic: true,
                            isPostActive: getActivePost,
                        },
                    },
                ],
            }),
            group
                ? this.postVerification.getSumVerificationByGroup()
                : Promise.resolve(true),
        ]);
        const limiter = (await this.pendingPostLimiter.limit(results, count, {
            start: query.limit,
        })) as LimitedPostVerificationDTO;
        if (!group) {
            return limiter;
        }
        limiter.groups = groupResult;
        return limiter;
    }
}
