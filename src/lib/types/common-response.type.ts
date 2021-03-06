import { Type } from "@nestjs/common";
import { Expose, Type as _Type } from "class-transformer";

export interface ResponseOptions {
    dataTransform?: (obj) => any;
}

export const CommonResponse = (
    type?: Type<any>,
    opts?: ResponseOptions,
): Type<any> => {
    const { dataTransform } = opts ?? {
        dataTransform: type
            ? ((obj) => new type(obj)).bind(this)
            : (obj) => obj,
    };

    class CommonResponse {
        code: number;

        @_Type(({ object }) => {
            if (!object || !type) {
                return () => object;
            }
            return type;
        })
        data?: any;

        @Expose({
            name: "error_type",
        })
        errorType?: string;

        error?: string;

        constructor(partial: Partial<CommonResponse>) {
            const newPartial = {
                code: partial.code,
                error: partial.error,
                data: dataTransform?.(partial.data),
            };
            Object.assign(this, newPartial);
        }
    }

    return CommonResponse;
};
