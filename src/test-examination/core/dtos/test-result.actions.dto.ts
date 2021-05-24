import { Transform, Type } from "class-transformer";
import { IsEmpty, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateTestResultDTO {
    @IsNotEmpty()
    test_id: string;

    @IsEmpty()
    user_id?: string;

    @IsOptional()
    @Type(() => CreateSentenceResultDTO)
    results?: CreateSentenceResultDTO[];
}

export class CreateSentenceResultDTO {
    @IsNotEmpty()
    user_answer: number;

    @IsNotEmpty()
    sentence_id: string;
}

export class SearchTestResultsDTO {
    start?: number;
    limit?: number;

    @Transform(({ value }) => value ?? "created_date")
    sort_by?: string;

    @Transform(({ value }) => parseInt(value ?? "-1"))
    @IsOptional()
    @IsNumber()
    sort_order?: number;

    user_id?: string;
}
