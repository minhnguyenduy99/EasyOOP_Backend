import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class EntityPolicy extends Document {
    @Prop({
        required: true,
    })
    entity_name: string;

    @Prop({
        required: true,
    })
    policy_name: string;

    @Prop({
        required: true,
        type: Types.Array,
        default: [],
    })
    actions: any[];

    isAllowedAll?: boolean;
}

export const EntityPolicySchema = SchemaFactory.createForClass(EntityPolicy);

EntityPolicySchema.virtual("isAllowedAll").get(function () {
    return this.actions[0] === "*";
});

EntityPolicySchema.index(
    {
        policy_name: 1,
    },
    {
        unique: true,
    },
);

EntityPolicySchema.index({
    "actions.type": 1,
});
