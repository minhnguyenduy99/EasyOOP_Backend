export class MongoErrors {
    static isDuplicateKeyError(error) {
        const errMessage = error?.message ?? error;
        return /duplicate key/g.test(errMessage);
    }
}
