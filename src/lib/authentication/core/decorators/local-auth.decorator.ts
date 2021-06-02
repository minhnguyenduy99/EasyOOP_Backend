import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { LocalGuard } from "../guards";
import { AttachTokenInterceptor } from "../interceptors";

export const LocalAuth = () => {
    return applyDecorators(
        UseGuards(LocalGuard),
        UseInterceptors(AttachTokenInterceptor),
    );
};
