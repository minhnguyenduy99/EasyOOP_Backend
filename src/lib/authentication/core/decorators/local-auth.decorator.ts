import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { LocalGuard } from "../guards";
import { LoginAttachAuthInfoInterceptor } from "../interceptors";

export const LocalAuth = () => {
    return applyDecorators(
        UseGuards(LocalGuard),
        UseInterceptors(LoginAttachAuthInfoInterceptor),
    );
};
