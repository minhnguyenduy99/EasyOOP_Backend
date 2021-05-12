import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { BaseModelSerializer, BasePaginationSerializer } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { TagDTO } from "src/tag";

export class CreateQ8ADTO {
    @IsNotEmpty()
    question: string;

    @IsNotEmpty()
    answer: string;

    @IsOptional()
    tag_id?: string;
}

export class UpdateQ8ADTO {
    @IsOptional()
    question?: string;

    @IsNotEmpty()
    answer: string;

    @IsOptional()
    tag_id: string;
}

export class SearchQ8ADTO {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    page?: number;

    @IsOptional()
    // @Transform(({ value }) => (value === "" ? null : value))
    value?: string;

    @IsOptional()
    @Transform(({ value }) => (value == 1 ? true : value == 0 ? false : null))
    hasTag?: boolean;

    start: number;
    limit: number;
}

export class Q8ADTO extends BaseModelSerializer {
    qa_id: string;
    question: string;
    answer: string;

    @Exclude()
    unaccented_question: string;

    tag_value?: string;
    tag_id: string;
    tag_type?: string;
}

export class UnusedTagDTO extends TagDTO {
    @Exclude()
    used: boolean;
}

export class UnusedQuestionTags extends PaginationSerializer(UnusedTagDTO) {
    @Exclude()
    next: number;

    @Exclude()
    previous: number;

    @Type(() => UnusedTagDTO)
    results: UnusedTagDTO[];
}
