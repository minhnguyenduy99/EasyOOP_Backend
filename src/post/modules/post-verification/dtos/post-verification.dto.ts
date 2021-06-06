import { Expose, Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { PostDTO } from "src/post/dtos";
import { TagDTO } from "src/tag";

export class PostVerificationDTO extends BaseModelSerializer {
    verification_id: string;
    type: number;
    created_date: number;
    status: number;

    @Type(() => PostDTO)
    post: PostDTO;

    manager_id: string;
    author_id?: string;
    post_id: string;

    @Type(() => TagDTO)
    tags: TagDTO[];
}
