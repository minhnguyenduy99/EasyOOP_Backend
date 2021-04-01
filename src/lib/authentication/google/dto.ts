import { Exclude } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";

export class AuthGoogleUserDTO extends BaseModelSerializer {
    @Exclude()
    username?: string;

    @Exclude()
    password: string;

    @Exclude()
    password_required: boolean;

    @Exclude()
    type: string;
}
