import { LimitOptions, LookupOptions } from "./interfaces";

export class AggregateBuilder {
    protected _aggregates: any[];
    protected _chains: any[];

    constructor() {
        this._aggregates = [];
        this._chains = [];
    }

    append(...aggregates: any[]) {
        this._aggregates.push(...aggregates);
        return this;
    }

    prepend(...aggregates: any[]) {
        this._aggregates.unshift(...aggregates);
        return this;
    }

    limit(options: LimitOptions) {
        const { limit = 100, start = 0, queryCount = true } = options;
        const aggregates = [
            {
                $facet: {
                    results: [
                        {
                            $skip: start,
                        },
                        {
                            $limit: limit,
                        },
                    ],
                    count: [
                        {
                            $count: "value",
                        },
                    ],
                },
            },
            {
                $set: {
                    count: {
                        $let: {
                            vars: {
                                first: {
                                    $arrayElemAt: ["$count", 0],
                                },
                            },
                            in: {
                                $ifNull: ["$$first.value", 0],
                            },
                        },
                    },
                },
            },
        ];
        this._aggregates.push(...aggregates);
        return this;
    }

    match(obj) {
        if (!obj) {
            return this;
        }
        const $match = {
            $match: obj,
        };
        this._aggregates.push($match);
        this._chains.push(this.match);
        return this;
    }

    sort(obj) {
        if (!obj) {
            return this;
        }
        const $sort = {
            $sort: obj,
        };
        this._aggregates.push($sort);
        this._chains.push(this.sort);
        return this;
    }

    lookup(option: LookupOptions) {
        const {
            from: _from,
            as,
            localField,
            foreignField,
            removeFields = [],
            single = true,
            pipeline = [],
            mergeObject = false,
            mergeOn = "ROOT",
            outer = true,
            letExpr = null,
        } = option;
        let from;
        if (typeof _from !== "string") {
            from = _from["collection"].collectionName;
        } else {
            from = _from;
        }
        const $project = removeFields?.reduce(
            (pre, cur) => ({
                ...pre,
                [cur]: 0,
            }),
            {},
        );
        const $lookup = {
            from,
            let: {
                local_field: `$${localField}`,
                ...(letExpr && letExpr),
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $cond: [
                                { $isArray: `$$local_field` },
                                { $in: [`$${foreignField}`, `$$local_field`] },
                                { $eq: [`$$local_field`, `$${foreignField}`] },
                            ],
                            // $or: [

                            //     { $eq: [`$$local_field`, `$${foreignField}`] },
                            //     { $in: [`$${foreignField}`, `$$local_field`] },
                            // ],
                        },
                    },
                },
                ...pipeline,
                {
                    $project,
                },
            ],
            as,
        };
        let replaceRoot = null,
            innerMatch = null,
            removeLookupField = null;
        const mergeObj = {
            [as]: { $arrayElemAt: [`$${as}`, 0] },
        };
        if (!outer) {
            innerMatch = {
                $match: {
                    [as]: { $ne: [] },
                },
            };
        }
        if (single) {
            replaceRoot = {
                ...(mergeOn === "ROOT" && {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                "$$ROOT",
                                mergeObject ? mergeObj[as] : mergeObj,
                            ],
                        },
                    },
                }),
                ...(mergeOn !== "ROOT" && {
                    $set: {
                        [mergeOn]: {
                            $mergeObjects: [
                                `$${mergeOn}`,
                                mergeObject ? mergeObj[as] : mergeObj,
                            ],
                        },
                    },
                }),
            };
            if (mergeObject) {
                removeLookupField = {
                    $project: {
                        [as]: 0,
                    },
                };
            }
        }
        const lookupAggregates = [
            { $lookup },
            { ...(outer || innerMatch) },
            { ...(single && replaceRoot) },
            { ...(single && mergeObject && removeLookupField) },
        ].filter((stage) => Object.keys(stage).length !== 0);

        this._aggregates.push(...lookupAggregates);

        this._chains.push(this.lookup);
        return this;
    }

    removeFields(fields: string[]) {
        const [, last] = this._aggregates;
        const newProjects = fields?.reduce(
            (pre, cur) => ({
                ...pre,
                [cur]: 0,
            }),
            {},
        ) as any;
        if (last?.$project) {
            last.$project = {
                ...last.$project,
                ...newProjects,
            };
        } else {
            this._aggregates.push({
                $project: newProjects,
            });
        }
        this._chains.push(this.removeFields);
        return this;
    }

    aggregate(aggregates: any[] | any) {
        if ("length" in aggregates) {
            this._aggregates.push(...aggregates);
        } else {
            this._aggregates.push(aggregates);
        }
        this._chains.push(this.aggregate);
        return this;
    }

    log<T extends { log(...data: any[]): void }>(logger: T) {
        (logger ?? console).log(this._aggregates);
        return this;
    }

    build() {
        const result = [...this._aggregates];
        this._aggregates.length = 0;
        return result;
    }
}
