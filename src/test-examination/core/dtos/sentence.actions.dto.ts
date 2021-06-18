import { Transform } from "class-transformer";
import {
    IsArray,
    IsEmpty,
    IsNotEmpty,
    IsNumber,
    IsOptional,
} from "class-validator";

export class CreateSentenceDTO {
    @IsOptional()
    @IsNumber({
        allowNaN: false,
        allowInfinity: false,
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
    @Transform(({ value }) => value ?? 0)
    score: number;

    @IsOptional()
    image_url: string;

    @IsEmpty()
    test_id: string;
}

export class UpdateSentenceDTO {
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
