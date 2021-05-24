import { Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { SentenceDTO } from "./sentence.dto";

export class TestResultDTO extends BaseModelSerializer {
    test_id: string;
    user_id: string;
    results: any[];
    obtained_score: number;
    total_score: number;
    created_date: number;
    correct_answer_count: number;
    total_sentence_count?: number;
}

export class SentenceResultDTO extends SentenceDTO {
    sentence_id: string;
    user_answer: number;
    obtained_score?: number;
}

export class DetailedTestResultDTO extends PaginationSerializer(
    SentenceResultDTO,
) {
    test_id: string;
    total_sentence_count: number;
}
