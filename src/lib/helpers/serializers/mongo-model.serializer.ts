import { Exclude } from "class-transformer";
import { Document, ToObjectOptions } from "mongoose";
import { BaseSerializer } from "./base-serializer.serializer";

export interface ModelSerializerOptions extends ToObjectOptions {
    modelOption?: ToObjectOptions;
}

export abstract class BaseModelSerializer extends BaseSerializer<Document> {
    @Exclude()
    public _id: any;

    @Exclude()
    public __v: any;

    constructor(partial: Partial<Document>, options?: ToObjectOptions) {
        const toObject = partial.toObject ?? (() => partial);
        super(toObject(options));
    }
}
