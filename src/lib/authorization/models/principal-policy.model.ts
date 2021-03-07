import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Principal } from "./principal.model";

@Schema()
export class PrincipalPolicy extends Document {
    @Prop({
        required: true,
        ref: Principal.name,
    })
    principal_id: string;

    @Prop({
        required: true,
    })
    entity_name: string;

    @Prop({
        required: true,
    })
    action_name: string;

    @Prop({
        required: false,
        type: [String],
        default: [],
    })
    resources: string[];

    is_allowed_all?: boolean;
}

export const PrincipalPolicySchema = SchemaFactory.createForClass(
    PrincipalPolicy,
);

PrincipalPolicySchema.virtual("is_allowed_all").get(function () {
    return this.resources[0] === "*";
});

PrincipalPolicySchema.index(
    {
        principal_id: 1,
        entity_name: 1,
        action_name: 1,
    },
    {
        unique: true,
    },
);

PrincipalPolicySchema.index({
    resources: 1,
});
