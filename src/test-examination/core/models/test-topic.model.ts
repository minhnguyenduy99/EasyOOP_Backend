import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenerateDigitID } from "src/lib/helpers";

@Schema()
export class TestTopic extends Document {
    @Prop({
        required: true,
    })
    topic_id: string;

    @Prop()
    topic_order: number;

    @Prop()
    topic_title: string;
}

export const TestTopicSchema = SchemaFactory.createForClass(TestTopic);

TestTopicSchema.pre("save", function (next) {
    if (this.isNew) {
        this.topic_id = GenerateDigitID(10);
    }
    next();
});

TestTopicSchema.index({
    topic_order: 1,
});

TestTopicSchema.index({
    topic_id: 1,
});
