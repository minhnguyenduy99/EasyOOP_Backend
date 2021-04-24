import { Expose } from "class-transformer";
import { IsIn, IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";
import { VERIFICATION_STATUS, VERIFICATION_TYPES } from "../consts";
import { Post } from "../../core";

export class CreateVerificationDTO {
    type: number;
    post_id: string;
    author_id: string;
    post_info?: Partial<Post>;
}

export class SearchVerificationDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? null)
    search: string;

    @Expose({
        name: "sort_by",
    })
    @Transform(({ value }) => value ?? "created_date")
    @IsOptional()
    sortBy?: string;

    @Expose({
        name: "sort_order",
    })
    @Transform(({ value }) => value ?? "desc")
    @IsIn(["asc", "desc"])
    @IsOptional()
    sortOrder?: string;

    @Transform(({ value }) => parseInt(value) ?? null)
    @IsIn(Object.values(VERIFICATION_TYPES).concat(null))
    @IsOptional()
    type?: number;

    @Transform(({ value }) => parseInt(value) ?? null)
    @IsIn(Object.values(VERIFICATION_STATUS).concat(null))
    @IsOptional()
    status?: number;

    @Transform(({ value }) => (value ? parseInt(value) : 10))
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
    })
    @IsOptional()
    limit?: number;
}
