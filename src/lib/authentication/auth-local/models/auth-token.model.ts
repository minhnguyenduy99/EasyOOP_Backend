import { Document, PromiseProvider } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class AuthToken extends Document {
    @Prop({
        required: true,
        unique: true,
    })
    user_id: string;

    @Prop()
    hash_refresh_token: string;

    @Prop()
    issued_at: number;

    @Prop()
    expired_in: number;
}

export const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
