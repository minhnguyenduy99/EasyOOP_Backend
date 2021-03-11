import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class PostMetadata extends Document {
    @Prop({
        type: Number,
        default: Date.now(),
    })
    created_date: number;

    @Prop({
        required: true,
    })
    content_file_id: string;

    @Prop({
        required: false,
    })
    content_file_url?: string;

    @Prop({
        required: false,
    })
    thumbnail_file_id: string;

    @Prop({
        required: false,
    })
    thumbnail_file_url?: string;
}

export const PostMetadataSchema = SchemaFactory.createForClass(PostMetadata);

PostMetadataSchema.index({
    created_date: -1,
});
