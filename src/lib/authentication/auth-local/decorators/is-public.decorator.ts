import { SetMetadata } from "@nestjs/common";
import { IS_PUBLIC_DECORATOR } from "../consts";

export const IsPublic = () => SetMetadata(IS_PUBLIC_DECORATOR, true);
