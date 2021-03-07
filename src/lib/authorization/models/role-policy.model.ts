import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { EntityPolicy } from "./entity-policy.model";

@Schema()
export class RolePolicy extends Document {
    entity_policy: EntityPolicy;

    @Prop({
        required: true,
    })
    role_name: string;

    @Prop({
        required: true,
    })
    entity_name: string;

    @Prop({
        required: true,
    })
    entity_policy_name: string;
}

export const RolePolicySchema = SchemaFactory.createForClass(RolePolicy);

RolePolicySchema.virtual("entity_policy", {
    ref: EntityPolicy.name,
    localField: "entity_policy_name",
    foreignField: "policy_name",
    justOne: true,
});

RolePolicySchema.index(
    {
        role_name: 1,
        entity_name: 1,
    },
    {
        unique: true,
    },
);

RolePolicySchema.index({
    principals: 1,
});
