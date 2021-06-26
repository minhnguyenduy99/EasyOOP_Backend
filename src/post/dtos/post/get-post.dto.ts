import { IsOptional, IsIn, IsNotEmpty, IsArray } from "class-validator";
import { Transform } from "class-transformer";
import { POST_STATUSES } from "src/post/modules/core";

export class GetPostsDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? "")
    search?: string;

    @IsOptional()
    @IsNotEmpty()
    @Transform(({ value }) => value ?? "post_title")
    sort_by?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsIn(["asc", "desc"])
    @Transform(({ value }) => value ?? "asc")
    sort_order?: string;

    @IsOptional()
    topic_id?: string;

    @IsOptional()
    @IsIn(Object.values(POST_STATUSES).concat(-1))
    @Transform(({ value }) => (value ? parseInt(value) : value))
    post_status?: number;

    @IsOptional()
    @Transform(
        ({ value }) => value?.split(",")?.filter((tag) => tag !== "") ?? [],
    )
    tags: string[];

    @IsOptional()
    @Transform(({ value }) => (value ? parseInt(value) : value))
    tagSearchType: number;
}
