import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenerateDigitID } from "src/lib/helpers";

@Schema()
export class TestResult extends Document {
    @Prop({
        required: true,
    })
    result_id: string;

    @Prop({
        required: true,
    })
    test_id: string;

    @Prop()
    user_id: string;

    @Prop()
    results: any[];

    @Prop()
    obtained_score: number;

    @Prop()
    total_score: number;

    @Prop()
    correct_answer_count: number;

    @Prop()
    created_date: number;

    @Prop()
    total_sentence_count: number;
}

export const TestResultSchema = SchemaFactory.createForClass(TestResult);

TestResultSchema.pre("save", function (next) {
    if (this.isNew) {
        this.created_date = Date.now();
        this.result_id = GenerateDigitID(10);
    }
    this.total_sentence_count = undefined;
    next();
});

TestResultSchema.index(
    {
        result_id: 1,
    },
    {
        unique: true,
    },
);

TestResultSchema.index(
    {
        user_id: 1,
        test_id: 1,
    },
    {
        unique: true,
    },
);

TestResultSchema.index({
    user_id: 1,
    created_date: -1,
});

TestResultSchema.index({
    user_id: 1,
    score: -1,
});
