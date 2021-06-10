import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { BaseModelSerializer } from "src/lib/helpers";
import { TEST_STATUSES, TEST_TYPES } from "../consts";

export class CreateTestExaminationDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsIn(Object.values(TEST_TYPES))
    type: number;

    @IsNotEmpty()
    topic_id: string;

    @IsOptional()
    @IsNumber()
    limited_time?: number;

    @IsNotEmpty()
    @IsNumber()
    default_score_per_sentence: number;

    creator_id: string;
}

export class UpdateTestExaminationDTO {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    @IsIn(Object.values(TEST_TYPES))
    type: number;

    @IsNotEmpty()
    topic_id: string;

    @IsNumber()
    limited_time?: number;

    @IsNotEmpty()
    @IsNumber()
    default_score_per_sentence: number;

    creator_id: string;
}

export class SearchTestDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? "")
    title?: string;

    @IsOptional()
    creator_id?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value ?? 0))
    @IsNumber()
    verifying_status?: number;

    @IsOptional()
    @Transform(({ value }) => value ?? null)
    topic_id?: string;

    @IsOptional()
    @Transform(({ value }) => parseInt(value ?? 0))
    @IsNumber()
    type?: number;

    @Transform(({ value }) => parseInt(value ?? "-1"))
    @IsOptional()
    @IsNumber()
    sort_order?: number;

    @Transform(({ value }) => value ?? "created_date")
    sort_by?: number;
}
