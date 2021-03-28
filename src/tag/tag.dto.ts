import { IsIn, IsNotEmpty } from "class-validator";
import { BaseModelSerializer } from "src/lib/helpers";
import { TagType } from "./consts";

export class TagSearchDTO {
    @IsNotEmpty()
    value: string;

    @IsIn(Object.values(TagType))
    @IsNotEmpty()
    type: TagType;
}

export class TagDTO extends BaseModelSerializer {
    tag_id: string;
    tag_value: string;
    tag_type: string;
}
