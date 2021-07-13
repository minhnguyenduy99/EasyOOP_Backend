import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { TestExamination, TestTopic } from "../../models";
import { SentenceFilterOptions, TestFilter } from "../interfaces";

@Injectable()
export class SentenceServiceHelper {
    protected builder: AggregateBuilder;

    constructor(
        private logger: Logger,
        @InjectModel(TestExamination.name)
        private testModel: Model<TestExamination>,
        @InjectModel(TestTopic.name)
        private testTopicModal: Model<TestTopic>,
    ) {
        this.builder = new AggregateBuilder();
    }

    filterByTestId(options: SentenceFilterOptions) {
        const { test_id } = options;
        this.builder.match({
            ...(test_id && { test_id }),
        });
        return this;
    }

    groupWithTopic() {
        this.builder.lookup({
            from: this.testTopicModal,
            localField: "topic_id",
            foreignField: "topic_id",
            mergeObject: true,
            single: true,
            as: "topic",
            removeFields: ["__v"],
        });
        return this;
    }

    groupByTest() {
        this.builder
            .aggregate({
                $addFields: {
                    use_default_score: {
                        $cond: [{ $eq: ["$score", 0] }, 1, 0],
                    },
                },
            })
            .aggregate({
                $group: {
                    _id: "$test_id",
                    total_score: {
                        $sum: "$score",
                    },
                    default_score_sentence_count: {
                        $sum: "$use_default_score",
                    },
                },
            })
            .lookup({
                from: this.testModel,
                localField: "_id",
                foreignField: "test_id",
                mergeObject: true,
                single: true,
                as: "test",
                removeFields: ["__v"],
            })
            .aggregate({
                $set: {
                    total_score: {
                        $sum: [
                            "$total_score",
                            {
                                $multiply: [
                                    "$default_score_sentence_count",
                                    "$default_score_per_sentence",
                                ],
                            },
                        ],
                    },
                },
            });
        return this;
    }

    limit(start: number, limit: number) {
        this.builder
            .sort({
                order: 1,
            })
            .limit({ start, limit });
        return this;
    }

    build() {
        return this.builder.build();
    }
}
