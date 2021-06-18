import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenerateDigitID } from "src/lib/helpers";

@Schema()
export class Sentence extends Document {
    @Prop({
        unique: true,
    })
    sentence_id: string;

    @Prop({
        required: true,
    })
    test_id: string;

    @Prop({
        required: true,
    })
    order: number;

    @Prop()
    question: string;

    @Prop({
        required: true,
    })
    answer: number;

    @Prop({
        required: true,
        type: [String],
    })
    options: string[];

    @Prop({
        required: false,
    })
    score?: number;

    @Prop({
        required: false,
    })
    image_url?: string;
}

export const SentenceSchema = SchemaFactory.createForClass(Sentence);

SentenceSchema.pre("save", function (next) {
    if (this.isNew) {
        this.sentence_id = GenerateDigitID(10);
    }
    next();
});

SentenceSchema.index({
    test_id: 1,
    order: 1,
});
