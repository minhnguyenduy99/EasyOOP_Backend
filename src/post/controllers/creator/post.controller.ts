import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    UseFormData,
    Serialize,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
} from "src/lib/helpers";
import { IPaginator, PaginatorFactory } from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { PostFilterOptions, POST_ERRORS } from "../../helpers";
import {
    CreatePostDTO,
    GetPostsDTO,
    PaginatedPostDTO,
    PostDTO,
    SortOptions,
} from "../../dtos";
import { PostService } from "../../services";
import { ERRORS, TAG_TYPES } from "src/post/modules/core";
import { PostVerificationService } from "src/post/modules/post-verification";
import { VERIFICATION_TYPES } from "src/post/modules/post-verification/consts";
import { AuthorizeClass } from "src/lib/authorization";
import { RoleAuthorizationGuard, RoleUserData } from "src/role-management";
import { AuthUserDecorator, TokenAuth } from "src/lib/authentication";
import { TagDTO, TagService } from "src/tag";

@Controller("/creator/posts")
@UseInterceptors(ResponseSerializerInterceptor)
@UseGuards(RoleAuthorizationGuard)
@TokenAuth()
@AuthorizeClass({
    entity: "CreatorPost",
})
export class CreatorPostController {
    protected readonly DEFAULT_PAGE_SIZE = 6;
    protected paginator: IPaginator;

    constructor(
        private postService: PostService,
        private postVerification: PostVerificationService,
        private tagService: TagService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "",
            pageSize: this.DEFAULT_PAGE_SIZE,
            pageParamType: "param",
        });
    }

    @Post()
    @UseFormData({
        fileField: ["content_file", "thumbnail_file"],
        jsonFields: ["tags", "templates"],
    })
    async createPost(
        @Body() dto: CreatePostDTO,
        @AuthUserDecorator() author: RoleUserData,
    ) {
        dto.author_id = author.role_id;
        const result = await this.postService.createPost(dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        const { post_id } = result.data;
        const createdPost = await this.postService.getPostById(post_id, false);
        this.postVerification.createVerification({
            type: VERIFICATION_TYPES.CREATED,
            post_id: result.data.post_id,
            author_id: author.role_id,
            post_info: createdPost,
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
        jsonFields: ["tags", "templates"],
    })
    async updatePost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
        @Body() dto: CreatePostDTO,
        @AuthUserDecorator() author: RoleUserData,
    ) {
        dto.author_id = author.role_id;
        const result = await this.postService.updatePost(postId, dto);
        if (result["error"]) {
            throw new BadRequestException(result);
        }
        const { post_id } = result.data;
        const createdPost = await this.postService.getPostById(post_id, false);
        this.postVerification.createVerification({
            type: VERIFICATION_TYPES.UPDATED,
            post_id: result.data.post_id,
            author_id: author.role_id,
            post_info: createdPost,
        });
        return {
            code: 0,
            data: result.data.post_id,
        };
    }

    @Get("/:post_id")
    @Serialize(PostDTO)
    async getPostById(
        @Param("post_id", ParamValidationPipe)
        postId: string,
    ) {
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException(POST_ERRORS.PostNotFound);
        }
        return post;
    }

    @Get("/:post_id/status/all")
    @Serialize(PostDTO)
    async getAllVersionsOfPost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
    ) {
        const posts = await this.postService.getAllVersionsOfPost(postId);
        if (posts.length === 0) {
            throw new NotFoundException(POST_ERRORS.PostNotFound);
        }
        return posts;
    }

    @Delete("/:post_id")
    async deletePost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
        @AuthUserDecorator() author: RoleUserData,
    ) {
        const result = await this.postService.deletePost(postId);
        if (result["error"]) {
            if (result.code === ERRORS.ServiceError.code) {
                throw new InternalServerErrorException(ERRORS.ServiceError);
            }
            throw new BadRequestException(result);
        }
        const deletedPost = await this.postService.getAvailablePostById(
            postId,
            true,
        );
        this.postVerification.createVerification({
            type: VERIFICATION_TYPES.DELETED,
            post_id: postId,
            author_id: author.role_id,
            post_info: deletedPost,
        });
        return {
            code: result.code,
            data: result.data.post_id,
        };
    }

    @Get("/search/:page")
    @Serialize(PaginatedPostDTO)
    async getPosts(
        @Param("page", ParseIntPipe) page: number,
        @Query(QueryValidationPipe) searchOptions: GetPostsDTO,
        @AuthUserDecorator() author: RoleUserData,
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
            author_id: author.role_id,
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

    @Get("/topics/:topicId/latest")
    @Serialize(PostDTO)
    async getLatestPostOfTopic(@Param("topicId") topicId: string) {
        const post = await this.postService.getLatestPostOfTopic(topicId);
        if (!post) {
            return [];
        }
        return [post];
    }

    @Get("/tags/all")
    @Serialize(TagDTO)
    async getAllTagsOfPostType() {
        const listTags = await this.tagService.getAllTagsByType(TAG_TYPES.post);
        return listTags;
    }
}
