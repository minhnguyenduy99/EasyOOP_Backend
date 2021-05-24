import { BaseModelSerializer } from "src/lib/helpers";

export class SentenceDTO extends BaseModelSerializer {
    sentence_id: string;
    test_id: string;
    question: number;
    answer: number;
    options: string[];
    score?: number;
    image_url?: string;
}
