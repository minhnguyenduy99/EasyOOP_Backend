import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RoleActionPolicy } from "./role-action-policy.model";

@Schema()
export class Principal extends Document {
    @Prop({
        unique: true,
    })
    principal_id: string;

    @Prop({
        required: true,
    })
    role_name: string;
}

export const PrincipalSchema = SchemaFactory.createForClass(Principal);

PrincipalSchema.virtual("role_action_policies", {
    ref: RoleActionPolicy.name,
    localField: "role_name",
    foreignField: "role_name",
    justOne: false,
});
