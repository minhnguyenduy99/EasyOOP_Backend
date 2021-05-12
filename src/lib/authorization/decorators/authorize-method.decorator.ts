import { applyDecorators, SetMetadata } from "@nestjs/common";
import {
    DECORATOR_METHOD_TAG,
    DECORATOR_ACTION,
    DECORATOR_RESOURCE_HANDLER,
    MethodTagValues,
} from "../consts";
import { MethodAuthMetadata } from "../interfaces";

/**
 * Set metadata for method authorization.
 * @param metadata
 */
export function AuthorizeMethod(metadata: MethodAuthMetadata): MethodDecorator {
    if (!metadata) {
        return;
    }
    const { action, type, resourceHandler } = metadata;

    const decorators = [];

    decorators.push(SetMetadata(DECORATOR_ACTION, [action, type]));
    if (resourceHandler) {
        decorators.push(
            SetMetadata(DECORATOR_RESOURCE_HANDLER, resourceHandler),
        );
    }
    return applyDecorators(...decorators);
}
