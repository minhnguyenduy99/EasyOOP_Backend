import { Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { PostDTO } from "src/post/dtos";
import { ManagerDTO, CreatorDTO } from "src/role-management";

export class PostVerificationDTO extends BaseModelSerializer {
    verification_id: string;
    type: number;
    created_date: number;
    status: number;
    manager_id: string;
    author_id?: string;
    post_id: string;
    custom_info?: any;

    @Type(() => PostDTO)
    post?: PostDTO;

    @Type(() => ManagerDTO)
    manager?: ManagerDTO;

    @Type(() => CreatorDTO)
    creator?: CreatorDTO;
}

export class MinimumPostVerificationDTO extends BaseModelSerializer {
    post_id: string;
    post_title: string;
    author_id: string;
    status: string;
    verification_id: string;
    last_edited_date: number;
    created_date: number;
    verification_count: number;
}
