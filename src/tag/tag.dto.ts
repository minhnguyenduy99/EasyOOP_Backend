import { Transform, Type } from "class-transformer";
import {
    IsBoolean,
    IsIn,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from "class-validator";
import { BaseModelSerializer } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { TagType } from "./consts";

export class TagSearchDTO {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value ?? "1"))
    page?: number;

    @IsOptional()
    @Transform(({ value }) => value ?? null)
    value?: string;

    @IsIn(Object.values(TagType))
    @IsNotEmpty()
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
