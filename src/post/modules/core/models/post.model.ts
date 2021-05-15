import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { PostMetadata } from "./post-metadata.model";
import { GenerateDigitID } from "../id-generator";

@Schema()
export class Post extends Document {
    @Prop()
    post_id: string;

    @Prop({
        required: true,
    })
    post_title: string;

    @Prop({
        required: true,
        default: 1,
    })
    post_status: number;

    @Prop({
        type: Types.ObjectId,
        ref: PostMetadata.name,
        required: true,
    })
    post_metadata_id: string;

    @Prop({
        type: Number,
        default: Date.now(),
    })
    created_date: number;

    @Prop({
        required: true,
    })
    post_type: string;

    @Prop({
        required: false,
        type: Types.ObjectId,
        ref: "Topic",
    })
    topic_id?: Types.ObjectId;

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

    @Prop({
        required: true,
    })
    author_id: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.pre("save", function (next) {
    if (this.isNew && !this.post_id) {
        this.post_id = GenerateDigitID(10);
    }
    next();
});

PostSchema.index({
    author_id: 1,
});

PostSchema.index({
    post_id: 1,
});

PostSchema.index({
    post_status: 1,
});

PostSchema.index({
    post_title: "text",
});

PostSchema.index({
    topic_id: 1,
});

PostSchema.index({
    tags: 1,
});

PostSchema.index({
    created_date: -1,
});
