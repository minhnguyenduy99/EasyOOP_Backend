import { Type as _Type } from "@nestjs/common";
import { Expose, Type } from "class-transformer";
import { BaseModelSerializer } from "src/lib/helpers";
import { AuthUserDto } from "./auth-user.dto";

export const LoginResultDTO = (type: _Type<any> = AuthUserDto): _Type<any> => {
    class LoginResultDTOClass extends BaseModelSerializer {
        @Type(() => type)
        user?: any;
        @Expose({
            name: "access_token",
        })
        accessToken?: string;
        @Expose({
            name: "refresh_token",
        })
        refreshToken?: string;

        constructor(data: Partial<LoginResultDTOClass>) {
            super(data);
            this.user = new type(this.user);
        }
    }
    return LoginResultDTOClass;
};
