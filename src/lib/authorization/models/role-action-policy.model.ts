import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ExecSyncOptionsWithBufferEncoding } from "child_process";
import { Document } from "mongoose";

@Schema()
export class RoleActionPolicy extends Document {
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
    action_name: string;
}

export const RoleActionPolicySchema = SchemaFactory.createForClass(
    RoleActionPolicy,
);

RoleActionPolicySchema.index(
    {
        role_name: 1,
        entity_name: 1,
        action_name: 1,
    },
    {
        unique: 1,
    },
);
