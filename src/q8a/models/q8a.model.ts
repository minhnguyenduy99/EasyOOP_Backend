import { Document } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Q8AModel extends Document {
    @Prop({
        required: true,
    })
    question: string;

    @Prop({
        required: true,
    })
    uanccented_question: string;

    @Prop({
        required: true,
    })
    answer: string;
}

export const Q8ASchema = SchemaFactory.createForClass(Q8AModel);

Q8ASchema.index({
    unaccented_question: "text",
});
