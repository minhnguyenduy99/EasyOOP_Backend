import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { GenerateDigitID } from "../helpers/id-generator";

@Schema()
export class RoleConfig extends Document {
    @Prop()
    config_id: string;

    @Prop({
        type: Types.Map,
    })
    config: any;
}

export const RoleConfigSchema = SchemaFactory.createForClass(RoleConfig);

RoleConfigSchema.pre("save", function (next) {
    if (this.isNew && !this.config_id) {
        this.config_id = GenerateDigitID(10);
    }
    next();
});

RoleConfigSchema.index({
    config_id: 1,
});
