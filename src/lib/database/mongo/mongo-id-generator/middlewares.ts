import { AutoIDGenerator } from "./model";

export function save_generateIDMiddleware(idField: string, tableName) {
    return async function () {
        const modelInstance = this.model(AutoIDGenerator.name);
        try {
            const tableInfo = await modelInstance.findOneAndUpdate(
                {
                    table_name: tableName,
                },
                {
                    $inc: {
                        sequence: 1,
                    },
                },
                {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true,
                    useFindAndModify: false,
                },
            );
            this[idField] = tableInfo.sequence;
        } catch (err) {
            console.log(err);
        }
    };
}

export function insertMany_generateIDMiddleware(
    idField: string,
    tableName: string,
) {
    return async function (next, docs) {
        const modelInstance = this.model(AutoIDGenerator.name);
        try {
            const tableInfo = await modelInstance.findOneAndUpdate(
                {
                    table_name: tableName,
                },
                {
                    $inc: {
                        sequence: docs.length ?? 1,
                    },
                },
                {
                    upsert: true,
                    new: true,
                    setDefaultsOnInsert: true,
                    useFindAndModify: false,
                },
            );
            docs.forEach((doc, index) => {
                doc[idField] = tableInfo.sequence - docs.length + index + 1;
            });
            next();
        } catch (err) {
            console.log(err);
        }
    };
}
