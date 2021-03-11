import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    InternalServerErrorException,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import {
    MongoObjectIdValidator,
    ParamValidationPipe,
    QueryValidationPipe,
    UseFormData,
} from "src/lib/helpers";
import { IPaginator, PaginatorFactory } from "src/lib/pagination";
import {
    CreatePostDTO,
    DetailedPostDTO,
    GetPostsDTO,
    PaginatedPostDTO,
    PostDTO,
    SortOptions,
} from "../dtos";
import { PostFilterOptions } from "../helpers";
import { PostService } from "../services";

@Controller("/posts")
export class PostController {
    protected readonly DEFAULT_PAGE_SIZE = 10;
    protected paginator: IPaginator;

    constructor(
        private postService: PostService,
        private paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "localhost:3000",
            pageSize: this.DEFAULT_PAGE_SIZE,
        });
    }

    @Post()
    @UseFormData({
        fileField: ["content_file", "thumbnail_file"],
    })
    async createPost(@Body() dto: CreatePostDTO) {
        const { code, error, data } = await this.postService.createPost(dto);
        if (error) {
            throw new BadRequestException(error);
        }
        return {
            code,
            data: {
                post_id: data._id.toString(),
            },
        };
    }

    @Get("/search/:page")
    @UseInterceptors(ClassSerializerInterceptor)
    async getPosts(
        @Param("page", ParseIntPipe) page: number,
        @Query(QueryValidationPipe) searchOptions: GetPostsDTO,
    ) {
        const { search, sort_by, sort_order } = searchOptions;
        const limit = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        console.log(limit);
        const filter = {
            keyword: search,
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
        });
        return new PaginatedPostDTO(paginatedResults, {
            resultType: PostDTO,
            serializeResults: true,
        });
    }

    @Get("/topic/:topic_id/:page")
    @UseInterceptors(ClassSerializerInterceptor)
    async getPostByTopic(
        @Param("topic_id", new ParamValidationPipe(MongoObjectIdValidator))
        topicId: string,
        @Param("page", ParseIntPipe) page: number,
    ) {
        const result = await this.postService.getPostByTopic(topicId);
        if (result === null) {
            throw new NotFoundException("Invalid topic ID");
        }
        return result.map((post) => new PostDTO(post));
    }

    @Get("/:post_id")
    @UseInterceptors(ClassSerializerInterceptor)
    async getPostById(
        @Param("post_id", new ParamValidationPipe(MongoObjectIdValidator))
        postId: string,
    ) {
        const post = await this.postService.getPostById(postId);
        if (!post) {
            throw new NotFoundException("Post not found");
        }
        return new DetailedPostDTO(post);
    }

    // @Put("/:post_id")
    // @UseFormData({
    //     fileField: ["content_file", "thumbnail_file"],
    // })
    // async updatePost(
    //     @Param("topic_id", new ParamValidationPipe(MongoObjectIdValidator))
    //     topicId: string,
    //     @Body() updateDTO: UpdatePostDTO,
    // ) {}

    @Delete("/:post_id")
    async deletePost(
        @Param("post_id", new ParamValidationPipe(MongoObjectIdValidator))
        postId: string,
    ) {
        const result = await this.postService.deletePost(postId);
        if (result.code === -1) {
            throw new BadRequestException(result);
        } else {
            if (result.code === -2) {
                throw new InternalServerErrorException();
            }
        }
        return result;
    }
}
