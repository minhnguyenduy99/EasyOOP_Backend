import { applyDecorators, SetMetadata } from "@nestjs/common";
import {
    DECORATOR_ENTITY,
    DECORATOR_METHOD_TAG,
    DECORATOR_ACTION,
    ActionType,
    MethodTagValues,
    DECORATOR_RESOURCE_HANDLER,
} from "../consts";
import { ClassAuthMetadata } from "../interfaces";
import { AuthorizeMethod } from "./authorize-method.decorator";

/**
 * Set metadata for the class authorization.
 *
 * By default, the `AuthorizeMethod` is automatically applied on all the methods
 * with default options if it is not explicitly applied.
 *
 * @param metadata
 */
export function AuthorizeClass(metadata: ClassAuthMetadata): ClassDecorator {
    if (!metadata) {
        return;
    }

    const { entity, resourceHandler } = metadata;

    const decorators = [];
    decorators.push(SetMetadata(DECORATOR_ENTITY, entity));
    decorators.push(SetMetadata(DECORATOR_RESOURCE_HANDLER, resourceHandler));

    decorators.push(applyDefaultsOnMethod(metadata));

    return applyDecorators(...decorators);
}

function applyDefaultsOnMethod({ entity, resourceHandler }: ClassAuthMetadata) {
    return (f) => {
        const descriptors = Object.getOwnPropertyDescriptors(f.prototype);
        if (!entity) {
            return;
        }

        Object.keys(descriptors).forEach((key) => {
            if (key === "constructor") {
                return;
            }
            const descriptor = descriptors[key] as PropertyDescriptor;
            const method = descriptor.value;
            if (typeof method !== "function") {
                return;
            }
            const methodTag = Reflect.getMetadata(
                DECORATOR_METHOD_TAG,
                descriptor.value,
            );
            const action = Reflect.getMetadata(
                DECORATOR_ACTION,
                descriptor.value,
            );
            const fullAction = [
                `${entity}.${action?.[0] ?? method.name}`,
                action?.[1] ?? ActionType.role,
            ];

            switch (methodTag) {
                case MethodTagValues.Nonauthorize:
                    return;
                case MethodTagValues.Authorize: {
                    // Modify permission
                    Reflect.defineMetadata(
                        DECORATOR_ACTION,
                        fullAction,
                        method,
                    );
                    return;
                }
                default: {
                    applyDecoratorsOnTarget(
                        method,
                        AuthorizeMethod({
                            action: fullAction[0],
                            type: fullAction[1],
                            resourceHandler,
                        }),
                    );
                }
            }
        });
    };
}

function applyDecoratorsOnTarget(target: any, decorators: any) {
    return decorators(target);
}
