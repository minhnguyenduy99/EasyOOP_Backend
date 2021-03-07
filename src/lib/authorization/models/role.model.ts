import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Role extends Document {
    @Prop({
        unique: true,
    })
    role_name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.index({
    role_policy_names: 1,
});
