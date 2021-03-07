import { SetMetadata } from "@nestjs/common";
import { DECORATOR_METHOD_TAG, MethodTagValues } from "../consts";

/**
 * Exclude the authorization on method.
 */
export const NonAuthorize = () =>
    SetMetadata(DECORATOR_METHOD_TAG, MethodTagValues.Nonauthorize);
