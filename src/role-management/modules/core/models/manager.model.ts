import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { GenerateDigitID } from "../helpers/id-generator";

@Schema()
export class Manager extends Document {
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

export const ManagerSchema = SchemaFactory.createForClass(Manager);

ManagerSchema.pre("save", function (next) {
    if (this.isNew && !this.role_id) {
        this.role_id = GenerateDigitID(10);
        this.created_date = Date.now();
    }
    next();
});

ManagerSchema.index({
    role_id: 1,
});

ManagerSchema.index({
    user_id: 1,
});

ManagerSchema.index({
    created_date: -1,
});
