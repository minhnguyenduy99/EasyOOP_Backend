import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenerateDigitID } from "../helpers/id-generator";

@Schema()
export class Creator extends Document {
    @Prop()
    role_id: string;

    @Prop()
    alias: string;

    @Prop()
    user_id: string;

    @Prop()
    config_id: string;

    @Prop()
    created_date: number;
}

export const CreatorSchema = SchemaFactory.createForClass(Creator);

CreatorSchema.pre("save", function (next) {
    if (this.isNew && !this.role_id) {
        this.role_id = GenerateDigitID(10);
        this.created_date = Date.now();
    }
    next();
});

CreatorSchema.index({
    alias: "text",
});

CreatorSchema.index({
    role_id: 1,
});

CreatorSchema.index({
    user_id: 1,
});

CreatorSchema.index({
    created_date: -1,
});
