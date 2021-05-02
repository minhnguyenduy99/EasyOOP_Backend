import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Verifier extends Document {
    @Prop({
        type: Types.ObjectId,
    })
    user_id: string;

    @Prop()
    verify_method: string;

    @Prop()
    verify_code: string;

    @Prop()
    expired_in: number;
}

export const VerifierSchema = SchemaFactory.createForClass(Verifier);

VerifierSchema.index({
    verify_method: 1,
    user_id: 1,
});

VerifierSchema.index({
    user_id: 1,
});
