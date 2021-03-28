import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { PostMetadata } from "./post-metadata.model";

@Schema()
export class Post extends Document {
    @Prop({
        required: true,
    })
    post_title: string;

    @Prop({
        type: Types.ObjectId,
        ref: PostMetadata.name,
        required: true,
    })
    post_metadata_id: string;

    @Prop({
        required: true,
    })
    post_type: string;

    @Prop({
        required: false,
        type: Types.ObjectId,
        ref: "Topic",
    })
    topic_id?: string;

    @Prop({
        required: true,
        type: [String],
    })
    tags: string[];

    @Prop({
        required: false,
        type: Types.ObjectId,
        default: null,
    })
    previous_post_id: string;

    @Prop({
        required: false,
        type: Types.ObjectId,
        default: null,
    })
    next_post_id: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.index({
    post_title: "text",
});

PostSchema.index({
    topic_id: 1,
});

PostSchema.index({
    post_type: 1,
});

PostSchema.index({
    tags: 1,
});
