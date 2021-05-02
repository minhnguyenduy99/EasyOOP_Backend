import { Exclude } from "class-transformer";
import { Document, ToObjectOptions } from "mongoose";
import { BaseSerializer } from "./base-serializer.serializer";

export interface ModelSerializerOptions extends ToObjectOptions {
    modelOption?: ToObjectOptions;
}

const ToObjectFunction = (data: any, options?: any) => data.toObject(options);
const LiteralObjectFunction = (partial) => partial;
export abstract class BaseModelSerializer extends BaseSerializer<Document> {
    @Exclude()
    public _id: any;

    @Exclude()
    public __v: any;

    constructor(partial: Partial<Document>, options?: ToObjectOptions) {
        const transformer = partial.toObject
            ? ToObjectFunction
            : LiteralObjectFunction;
        super(transformer(partial, options));
    }
}
