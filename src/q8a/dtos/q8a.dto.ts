import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseModelSerializer, BasePaginationSerializer } from "src/lib/helpers";

export class CreateQ8ADTO {
    @IsNotEmpty()
    question: string;

    @IsNotEmpty()
    answer: string;
}

export class UpdateQ8ADTO {
    @IsOptional()
    question?: string;

    @IsNotEmpty()
    answer: string;
}

export class Q8ADTO extends BaseModelSerializer {
    question: string;
    answer: string;

    @Exclude()
    unaccented_question: string;

    tag_value?: string;
    tag_id: string;
    tag_type?: string;

    @Expose({
        name: "qa_id",
    })
    get qaId() {
        return this._id?.toString();
    }
}
