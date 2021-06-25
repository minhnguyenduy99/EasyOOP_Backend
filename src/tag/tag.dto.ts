import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from "class-validator";
import { BaseModelSerializer } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { TagType } from "./consts";

export class CreateTagsDTO {
    @IsNotEmpty()
    @IsIn(Object.keys(TagType))
    type: string;

    @IsArray()
    @Transform(({ value }) => value ?? [])
    tags: {
        tag_id: string;
        tag_value: string;
    }[];
}
export class UpdateTagDTO {
    @IsNotEmpty()
    @IsIn(Object.keys(TagType))
    tag_type: string;

    @IsNotEmpty()
    tag_value: string;
}

export class TagSearchDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? null)
    value?: string;

    @IsOptional()
    type?: TagType;

    @IsOptional()
    @Transform(({ value }) => (value ? (value != 0 ? true : false) : null))
    used?: boolean;

    start: number;

    limit: number;
}
export class TagDTO extends BaseModelSerializer {
    tag_id: string;
    tag_value: string;
    tag_type: string;
}
export class PaginatedTagDTO extends PaginationSerializer(TagDTO) {
    @Type(() => TagDTO)
    results: TagDTO[];

    constructor(result) {
        super(result, {
            serializeResults: true,
        });
    }
}
