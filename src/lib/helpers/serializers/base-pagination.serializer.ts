import { Type } from "@nestjs/common";
import { Type as TypeTransformer } from "class-transformer";
import { BaseSerializer } from "./base-serializer.serializer";
import { BaseModelSerializer } from "./mongo-model.serializer";

type ResultType<T extends BaseModelSerializer> = Type<T>;

interface PaginatedDTO {
    count: number;
    next: string;
    results: any[];
}

export interface SerializerOptions {
    serializeResults?: boolean;
    resultType?: ResultType<any>;
}

export abstract class BasePaginationSerializer<T extends BaseModelSerializer>
    extends BaseSerializer<PaginatedDTO>
    implements PaginatedDTO {
    count: number;
    next: string;
    results: T[];

    constructor(partial: Partial<PaginatedDTO>, options?: SerializerOptions) {
        super(partial);
        const { serializeResults, resultType } = options ?? {
            serializeResults: true,
        };
        if (!serializeResults) {
            return;
        }
        this.results = partial.results.map((result) => new resultType(result));
    }
}

export function PaginationSerializer<T extends BaseModelSerializer>(
    type: Type<T>,
): Type<any> {
    class Pagination
        extends BaseSerializer<PaginatedDTO>
        implements PaginatedDTO {
        count: number;
        next: string;

        @TypeTransformer(() => type)
        results: T[];

        constructor(partial: PaginatedDTO) {
            super(partial);
            this.results = partial.results.map((result) => new type(result));
        }
    }

    return Pagination;
}
