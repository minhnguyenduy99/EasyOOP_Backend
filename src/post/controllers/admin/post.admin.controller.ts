import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    InternalServerErrorException,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import {
    UseFormData,
    Serialize,
    ParamValidationPipe,
    BodyValidationPipe,
} from "src/lib/helpers";
import { IPaginator, PaginatorFactory } from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { CreatePostDTO } from "../../dtos";
import { ERRORS } from "../../errors";
import { PostService } from "../../services";

@Controller("/admin/posts")
export class AdminPostController {
    protected readonly DEFAULT_PAGE_SIZE = 6;
    protected paginator: IPaginator;

    constructor(
        private postService: PostService,
        paginatorFactory: PaginatorFactory,
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
        const result = await this.postService.createPost(dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return {
            code: result.code,
            data: result.data.post_id,
        };
    }

    @Serialize(CommonResponse())
    @Put("/:post_id")
    async updatePost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
        @Body(BodyValidationPipe) dto: CreatePostDTO,
    ) {
        const result = await this.postService.updatePost(postId, dto);
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
    ) {
        const result = await this.postService.deletePost(postId);
        if (result.error) {
            if (result.code === ERRORS.ServiceError.code) {
                throw new InternalServerErrorException(ERRORS.ServiceError);
            } else {
                throw new BadRequestException(result);
            }
        }
        return result;
    }
}
