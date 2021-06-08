import { Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { TestExaminationDTO } from "./test-examination.dto";

export class TestTopicDTO extends BaseModelSerializer {
    topic_id: string;
    topic_title: string;

    @Type(() => TestExaminationDTO)
    list_tests?: TestExaminationDTO[];
}
