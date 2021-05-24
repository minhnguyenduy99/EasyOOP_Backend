import { Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { SentenceDTO } from "./sentence.dto";

export class TestExaminationDTO extends BaseModelSerializer {
    test_id: string;
    title: string;
    created_date: number;
    type: number;
    creator_id: string;
    limited_time?: number;
    default_score_per_sentence: number;
    verifying_status: number;

    total_score?: number;

    @Type(() => SentenceDTO)
    sentences?: SentenceDTO[];
}

export class DetailedTestExamnimationDTO extends PaginationSerializer(
    SentenceDTO,
) {
    @Type(() => TestExaminationDTO)
    test: TestExaminationDTO;
}
