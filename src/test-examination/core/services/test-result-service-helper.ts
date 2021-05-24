import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { Sentence, TestExamination, TestResult } from "../models";

@Injectable()
export class TestResultServiceHelper {
    protected builder: AggregateBuilder;

    constructor(
        @InjectModel(TestResult.name)
        private testResultModel: Model<TestResult>,
        @InjectModel(TestExamination.name)
        private testModel: Model<TestExamination>,
        @InjectModel(Sentence.name)
        private sentenceModel: Model<Sentence>,
    ) {
        this.builder = new AggregateBuilder();
    }

    sort(sortBy, sortOrder) {
        this.builder.sort({
            [sortBy]: sortOrder,
        });
        return this;
    }

    filter({ user_id, test_id = null }) {
        this.builder.match({
            ...(user_id && { user_id }),
            ...(test_id && { test_id }),
        });
        return this;
    }

    limit(start, limit) {
        this.builder.limit({ start, limit });
        return this;
    }

    groupWithSentences(localField: string) {
        this.groupWithTest();
        this.builder
            .lookup({
                from: this.sentenceModel,
                localField: `${localField}.sentence_id`,
                foreignField: "sentence_id",
                removeFields: ["__v", "test_id"],
                single: false,
                mergeObject: true,
                as: "queried_results",
            })
            .aggregate({
                $set: {
                    [localField]: {
                        $map: {
                            input: `$${localField}`,
                            as: "result",
                            in: {
                                $mergeObjects: [
                                    "$$result",
                                    {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$queried_results",
                                                    as: "local_result",
                                                    cond: {
                                                        $eq: [
                                                            "$$result.sentence_id",
                                                            "$$local_result.sentence_id",
                                                        ],
                                                    },
                                                },
                                            },
                                            0,
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                },
            })
            .aggregate({
                $project: {
                    queried_results: 0,
                },
            });
        return this;
    }

    resultsInRange(start, limit, field: string) {
        this.builder.aggregate({
            $addFields: {
                [field]: {
                    $slice: ["$results", start, limit],
                },
            },
        });
        return this;
    }

    groupWithTest(type: "general" | "detail" = "general") {
        const removeFields = getRemoveFields(type);

        this.builder.lookup({
            from: this.testModel,
            localField: "test_id",
            foreignField: "test_id",
            mergeObject: true,
            single: true,
            as: "test",
            removeFields,
        });

        if (type === "detail") {
            return this;
        }

        this.builder.aggregate([
            {
                $addFields: {
                    total_sentence_count: {
                        $size: "$results",
                    },
                },
            },
            {
                $project: {
                    results: 0,
                },
            },
        ]);
        return this;

        function getRemoveFields(type) {
            switch (type) {
                case "general":
                    return [
                        "__v",
                        "created_date",
                        "verifying_status",
                        "default_score_per_sentence",
                        "type",
                        "limited_time",
                        "creator_id",
                        "list_sentence_ids",
                    ];
                case "detailed":
                    return ["__v", "created_date", "verifying_status"];
            }
        }
    }

    build() {
        return this.builder.build();
    }
}
