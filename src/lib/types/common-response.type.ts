import { Type } from "@nestjs/common";
import { Type as _Type } from "class-transformer";

export interface ResponseOptions {
    dataTransform?: (obj) => any;
}

export const CommonResponse = (
    type?: Type<any>,
    opts?: ResponseOptions,
): Type<any> => {
    const { dataTransform = (obj) => obj } = opts ?? {};

    class CommonResponse {
        code: number;

        @_Type(({ object }) => {
            if (!object || !type) {
                return () => object;
            }
            return type;
        })
        data?: any;

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
