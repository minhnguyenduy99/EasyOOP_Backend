import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { GenerateDigitID } from "../../core";

@Schema()
export class PostVerification extends Document {
    @Prop({
        required: false,
        unique: true,
    })
    verification_id: string;

    @Prop()
    type: number;

    @Prop({
        default: 0,
    })
    status?: number;

    @Prop({
        default: Date.now(),
    })
    created_date: number;

    @Prop()
    post_title: string;

    @Prop()
    post_id?: string;

    @Prop()
    manager_id: string;

    @Prop()
    author_id: string;

    @Prop({
        default: {},
        type: Object,
    })
    custom_info: any;
}

export const PostVerificaionSchema = SchemaFactory.createForClass(
    PostVerification,
);

PostVerificaionSchema.pre("save", function (next) {
    if (this.isNew) {
        this.verification_id = GenerateDigitID(15);
    }
    next();
});

PostVerificaionSchema.index({
    post_title: "text",
});

PostVerificaionSchema.index({
    created_date: -1,
});

PostVerificaionSchema.index({
    author_id: 1,
});

PostVerificaionSchema.index({
    manager_id: 1,
});

PostVerificaionSchema.index({
    type: 1,
});

PostVerificaionSchema.index({
    status: 1,
});
