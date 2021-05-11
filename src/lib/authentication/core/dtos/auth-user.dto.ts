import { Exclude, Expose } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";

export class AuthUserDto extends BaseModelSerializer {
    user_id: string;

    profile: any;

    @Exclude()
    username?: string;

    @Exclude()
    password: string;

    @Exclude()
    hash_refresh_token: string;

    @Exclude()
    token_expired: number;

    @Exclude()
    password_required: boolean;

    @Exclude()
    email: string;

    @Exclude()
    type: string;

    @Exclude()
    refreshToken?: string;

    @Expose({
        name: "access_token",
    })
    accessToken?: string;

    @Expose()
    role_id: string;
}
