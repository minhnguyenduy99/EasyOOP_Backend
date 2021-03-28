import { Type } from "class-transformer";
import { Type as _Type } from "@nestjs/common";
import { BaseModelSerializer } from "src/lib/helpers";

export interface LimitOptions {
    start?: number;
    limit?: number;
}

export interface SortOptions {
    field: string;
    asc?: boolean;
}

export interface PaginatedResult {
    count?: number;
    results: any[];
}

export function TagResult<Data extends BaseModelSerializer>(
    type?: _Type<Data>,
): _Type<any> {
    class TagResultClass extends BaseModelSerializer {
        tag_value: string;
        tag_id: string;
        tag_type: string;

        @Type(() => type)
        results: Data[];

        constructor(partial: Partial<TagResultClass>, results: Data[]) {
            super(partial);
            this.results = results.map((result) => new type(result));
        }
    }

    return TagResultClass;
}
