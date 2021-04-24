import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import {
    MongoObjectIdValidator,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import {
    GetPostsDTO,
    PaginatedPostDTO,
    PostDTO,
    PostWithTagDTO,
    PostWithTopicDTO,
    SortOptions,
} from "../dtos";
import { PostFilterOptions } from "../helpers";
import { POST_STATUSES } from "../modules/core";
import { PostService } from "../services";

@Controller("/posts")
@UseInterceptors(ResponseSerializerInterceptor)
export class PostController {
    protected readonly DEFAULT_PAGE_SIZE = 6;
    protected paginator: IPaginator;

    constructor(
        private postService: PostService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "http://localhost:3000",
            pageSize: this.DEFAULT_PAGE_SIZE,
        });
    }

    @Get("/search/:page")
    @Serialize(PaginatedPostDTO, true)
    async getPosts(
        @Param("page", ParseIntPipe) page: number,
        @Query(QueryValidationPipe) searchOptions: GetPostsDTO,
    ) {
        const { search, sort_by, sort_order } = searchOptions;
        const limit = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        const filter = {
            keyword: search,
            topic_id: searchOptions.topic_id,
            post_status: POST_STATUSES.ACTIVE,
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

    @Get("/topic/:topic_id")
    @UseInterceptors(ClassSerializerInterceptor)
    @Serialize(PostWithTopicDTO)
    async getPostByTopic(
        @Param("topic_id", new ParamValidationPipe(MongoObjectIdValidator))
        topicId: string,
    ) {
        const result = await this.postService.getPostByTopic(topicId);
        if (result === null) {
            throw new BadRequestException({
                code: -1,
                error: "Invalid topic ID",
            });
        }
        return result;
    }

    @Get("/:post_id")
    @Serialize(PostDTO)
    async getPostById(
        @Param("post_id", ParamValidationPipe)
        postId: string,
    ) {
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException({
                code: -1,
                error: "Post not found",
            });
        }
        return post;
    }

    @Get("/tags/search")
    @UseInterceptors(ClassSerializerInterceptor)
    @Serialize(PostWithTagDTO)
    async getPostsByTag(
        @Query("tags")
        tagStr: string,
        @Query("page", ParsePagePipe)
        page: number,
    ) {
        const limit = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        const tags = tagStr.trim().split(",");
        const result = await this.postService.getPostsByTag(tags, limit);
        return result;
    }
}
