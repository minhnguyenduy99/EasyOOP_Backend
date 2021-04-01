import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { Transform } from "class-transformer";

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
    topic_id: string;
}
