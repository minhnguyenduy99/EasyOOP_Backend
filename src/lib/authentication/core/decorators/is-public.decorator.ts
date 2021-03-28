import { SetMetadata } from "@nestjs/common";
import { DECORATORS } from "../consts";

export const IsPublic = () => SetMetadata(DECORATORS.IS_PUBLIC_DECORATOR, true);
