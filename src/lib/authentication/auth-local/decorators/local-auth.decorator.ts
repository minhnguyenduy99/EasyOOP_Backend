import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { LocalAuthGuard } from "../guards";
import {
    AttachTokenInterceptor,
    SetRequestTokensInterceptor,
} from "../interceptors";

export const LocalAuth = () => {
    return applyDecorators(
        UseGuards(LocalAuthGuard),
        UseInterceptors(SetRequestTokensInterceptor, AttachTokenInterceptor),
    );
};
