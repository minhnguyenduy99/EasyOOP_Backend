import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Tag extends Document {
    @Prop({
        required: true,
    })
    tag_id: string;

    @Prop({
        required: true,
    })
    tag_type: string;

    @Prop({
        required: true,
    })
    tag_value: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.index({
    tag_value: "text",
});

TagSchema.index({
    tag_id: 1,
});

TagSchema.index({
    tag_type: 1,
    tag_id: 1,
});
