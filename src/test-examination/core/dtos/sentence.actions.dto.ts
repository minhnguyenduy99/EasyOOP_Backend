import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateSentenceDTO {
    @IsOptional()
    @IsNumber({
        allowNaN: true,
    })
    @Transform(({ value }) => value ?? Number.NaN)
    order: number;

    @IsNotEmpty()
    question: string;

    @IsNotEmpty()
    @IsNumber()
    answer: number;

    @IsNotEmpty()
    @IsArray()
    options: string[];

    @IsNotEmpty()
    @IsNumber()
    score: number;

    @IsOptional()
    image_url: string;
}

export class UpdateSentenceDTO {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => value ?? null)
    order: number;

    @IsNotEmpty()
    question: string;

    @IsNotEmpty()
    @IsNumber()
    answer: number;

    @IsNotEmpty()
    @IsArray()
    options: string[];

    @IsNotEmpty()
    @IsNumber()
    score: number;

    @IsOptional()
    image_url: string;
}
