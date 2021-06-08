import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { GenerateDigitID } from "src/lib/helpers";

@Schema()
export class TestExamination extends Document {
    @Prop({
        unique: true,
    })
    test_id: string;

    @Prop({
        required: true,
    })
    title: string;

    @Prop()
    topic_id: string;

    @Prop()
    created_date: number;

    @Prop({
        required: true,
    })
    type: number;

    @Prop()
    creator_id: string;

    @Prop({
        required: false,
    })
    limited_time?: number;

    @Prop({
        required: true,
    })
    default_score_per_sentence: number;

    @Prop({
        required: true,
    })
    verifying_status: number;

    @Prop({
        required: false,
        default: [],
    })
    list_sentence_ids?: any[];

    total_score?: number;

    sentences?: any[];
}

export const TestExamninationSchema = SchemaFactory.createForClass(
    TestExamination,
);

TestExamninationSchema.pre("save", function (next) {
    if (this.isNew) {
        this.test_id = GenerateDigitID(10);
        this.created_date = Date.now();
    }
    next();
});

TestExamninationSchema.index({
    title: "text",
});

TestExamninationSchema.index({
    topic_id: 1,
});

TestExamninationSchema.index({
    creator_id: 1,
});

TestExamninationSchema.index({
    verifying_status: 1,
});

TestExamninationSchema.index({
    type: 1,
});

TestExamninationSchema.index({
    created_date: -1,
});

TestExamninationSchema.index({
    list_sentence_ids: 1,
});
