import { Exclude } from "class-transformer";

export class AuthTokenDTO {
    @Exclude()
    _id: any;

    @Exclude()
    __v: any;

    user_id: string;

    @Exclude()
    hash_refresh_token: string;

    expired_in: number;

    constructor(partial: Partial<AuthTokenDTO>) {
        Object.assign(this, partial);
    }
}
