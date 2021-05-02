import { Exclude } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";

export class AuthUserDto extends BaseModelSerializer {
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
}
