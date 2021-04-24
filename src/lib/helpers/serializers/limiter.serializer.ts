import { Type } from "class-transformer";
import { Type as NestType } from "@nestjs/common";
import { BaseSerializer } from "./base-serializer.serializer";
import { BaseModelSerializer } from "./mongo-model.serializer";

type ResultType<T extends BaseModelSerializer> = NestType<T>;

export type LimiterSerializerType = {
    new (partial: Partial<LimiterDTO>): BaseSerializer<LimiterDTO>;
};

export interface LimiterDTO {
    remain_item_count: number;
    next: string;
    results: any[];
}

export interface SerializerOptions {
    serializeResults?: boolean;
    resultType?: ResultType<any>;
}

export function LimiterSerializer(
    options?: SerializerOptions,
): LimiterSerializerType {
    const { resultType, serializeResults = true } = options ?? {
        serializeResults: true,
        resultType: BaseModelSerializer,
    };

    class BaseLimiterSerializer
        extends BaseSerializer<LimiterDTO>
        implements LimiterDTO {
        remain_item_count: number;
        next: string;

        @Type(() => resultType)
        results: any[];

        constructor(partial: Partial<LimiterDTO>) {
            super(partial);
            if (!serializeResults) {
                return;
            }
        }
    }
    return BaseLimiterSerializer;
}
