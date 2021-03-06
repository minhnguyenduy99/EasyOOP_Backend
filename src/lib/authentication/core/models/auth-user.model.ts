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
        default: false,
    })
    password_required: boolean;

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

    @Prop()
    created_date: number;

    @Prop({
        default: false,
    })
    is_active?: boolean;

    @Prop()
    login_status: number;

    @Prop()
    hash_refresh_token: string;

    @Prop()
    token_expired: number;

    @Prop()
    active_role: string;

    @Prop({
        type: Array,
        required: true,
        default: [],
    })
    roles: string[];

    @Prop({
        type: Object,
        required: false,
        default: {},
    })
    profile: any;

    @Prop({
        required: false,
        default: null,
    })
    role_id?: string;
}

export const AuthUserSchema = SchemaFactory.createForClass(AuthUser);

AuthUserSchema.pre("save", function (next) {
    if (this.isNew) {
        this.created_date = Date.now();
    }
    next();
});
AuthUserSchema.index({
    user_id: 1,
});
