import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { GenerateDigitID } from "src/post/modules/core/id-generator";

@Schema()
export class Q8AModel extends Document {
    @Prop({
        required: true,
        unique: true,
    })
    qa_id: string;

    @Prop({
        required: true,
    })
    question: string;

    @Prop({
        required: true,
    })
    unanccented_question: string;

    @Prop({
        required: true,
    })
    answer: string;

    @Prop({
        required: true,
    })
    tag_id: string;
}

export const Q8ASchema = SchemaFactory.createForClass(Q8AModel);

Q8ASchema.pre("save", function (next) {
    if (this.isNew && !this.qa_id) {
        this.qa_id = GenerateDigitID(10);
    }
    next();
});

Q8ASchema.index({
    unanccented_question: "text",
    question: "text",
});

Q8ASchema.index({
    tag_id: -1,
});
