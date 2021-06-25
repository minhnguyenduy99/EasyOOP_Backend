import { AppServiceError } from "src/lib/types";

export class MongoErrors {
    static isDuplicateKeyError(error: MongoDuplicateKeyError) {
        if (error.code !== 11000) {
            return false;
        }
        return {
            message: "Field duplication",
            duplicates: Object.keys(error.keyPattern),
        };
    }

    static writeBulkError(
        code: number,
        err: MongoWriteBulkError<any>,
    ): AppServiceError {
        return {
            code,
            errorType: "Mongo.WriteErrorBulk",
            message: "Write bulk error",
            context: {
                errors: err.writeErrors,
            },
        };
    }
}

export interface MongoDuplicateKeyError {
    driver: boolean;
    name: string;
    index: number;
    code: number;
    keyPattern: {
        [key: string]: number;
    };
    keyValue: {
        [key: string]: number;
    };
}

export interface MongoWriteBulkError<T> {
    writeErrors: WriteErrorObject<T>[];
    errmsg?: string;
    writeConcernErrors?: any[];
    result: {
        nInserted?: number;
        nUpserted?: number;
        nMatched?: number;
        nModified?: number;
        nRemoved?: number;
        upserted?: any[];
    };
}

export interface WriteErrorObject<T> {
    err: {
        index: number;
        code?: number;
        errmsg?: string;
        op: T;
    };
}
