import { Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { SentenceDTO } from "./sentence.dto";
import { TestTopicDTO } from "./test-topic.dto";

export class TestExaminationDTO extends BaseModelSerializer {
    test_id: string;
    title: string;
    created_date: number;
    type: number;
    topic_id: string;
    creator_id: string;
    limited_time?: number;
    default_score_per_sentence: number;
    verifying_status: number;

    total_score?: number;

    @Type(() => SentenceDTO)
    sentences?: SentenceDTO[];

    @Type(() => TestTopicDTO)
    topic?: TestTopicDTO;

    list_sentence_ids?: string[];
}

export class DetailedTestExamnimationDTO extends PaginationSerializer(
    SentenceDTO,
) {
    @Type(() => TestExaminationDTO)
    test: TestExaminationDTO;
}
