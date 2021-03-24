import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class AuthUser extends Document {
    @Prop({
        required: true,
        unique: true,
    })
    user_id: string;

    @Prop({
        required: true,
        unique: true,
    })
    username: string;

    @Prop({
        required: false,
        default: null,
    })
    password?: string;

    @Prop({
        unique: true,
        default: "",
    })
    email: string;

    @Prop({
        default: "official",
    })
    type?: string;

    @Prop({
        default: false,
    })
    is_active?: boolean;

    @Prop({
        type: Object,
        required: false,
        default: {},
    })
    profile: any;
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser);

AuthUserSchema.index({
    user_id: 1,
});
