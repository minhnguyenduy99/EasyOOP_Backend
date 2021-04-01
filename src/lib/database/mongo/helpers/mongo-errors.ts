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
