import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Topic extends Document {
    @Prop({
        required: true,
        unique: true,
    })
    topic_title: string;

    @Prop({
        type: Types.ObjectId,
        required: false,
        default: null,
    })
    first_post_id: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);

TopicSchema.index({
    post_title: "text",
});
