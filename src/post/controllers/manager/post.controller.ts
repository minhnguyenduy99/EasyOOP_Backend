import {
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { TokenAuth } from "src/lib/authentication";
import { AuthorizeClass } from "src/lib/authorization";
import {
    Serialize,
    ParamValidationPipe,
    ResponseSerializerInterceptor,
} from "src/lib/helpers";
import { PostDTO } from "src/post/dtos";
import { PostService } from "src/post/services";
import { RoleAuthorizationGuard } from "src/role-management";

@Controller("/manage/posts")
@UseGuards(RoleAuthorizationGuard)
@TokenAuth()
@AuthorizeClass({
    entity: "ManagerPost",
})
@UseInterceptors(ResponseSerializerInterceptor)
export class PostManagerController {
    constructor(private postService: PostService) {}

    @Get("/:post_id")
    @Serialize(PostDTO)
    async getPostById(
        @Param("post_id", ParamValidationPipe) postId: string,
        @Query("active", ParseBoolPipe) active: boolean,
    ) {
        const post = await this.postService.getPostById(postId, active);
        if (!post) {
            throw new NotFoundException({
                code: -1,
                error: "Post not found",
            });
        }
        return post;
    }
}
