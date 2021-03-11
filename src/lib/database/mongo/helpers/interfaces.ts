import { Model } from "mongoose";

export interface LookupOptions extends BaseLookupOptions {
    localField: string;
    foreignField: string;
    single?: boolean;
    pipeline?: any[];
    mergeObject?: boolean;
    removeFields?: string[];
    outer?: boolean;
}

export interface PipelineLookupOptions extends BaseLookupOptions {
    pipeline: any[];
}

export interface LimitOptions {
    start: number;
    limit: number;
    queryCount?: boolean;
}

interface BaseLookupOptions {
    from: Model<any> | String;
    as: string;
}
