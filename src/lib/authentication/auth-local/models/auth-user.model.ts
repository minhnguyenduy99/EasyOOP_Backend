import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class AuthUserModel extends Document {
    @Prop({
        required: true,
        unique: true,
    })
    username: string;

    @Prop()
    password: string;

    @Prop({
        unique: true,
        default: "",
    })
    email: string;

    @Prop({
        default: "user",
    })
    type: string;

    @Prop({
        type: Object,
        required: false,
        default: {},
    })
    auth_profile: any;
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUserModel);
