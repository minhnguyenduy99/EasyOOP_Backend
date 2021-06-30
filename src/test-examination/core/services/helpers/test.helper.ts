import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { Sentence, TestTopic } from "../../models";
import { TestFilter } from "../interfaces";

@Injectable()
export class TestServiceHelper {
    protected builder: AggregateBuilder;

    constructor(
        private logger: Logger,
        @InjectModel(Sentence.name) private sentenceModel: Model<Sentence>,
        @InjectModel(TestTopic.name) private topicModel: Model<TestTopic>,
    ) {
        this.builder = new AggregateBuilder();
    }

    filter(filter: TestFilter) {
        const { title, creator_id, available_status, type, topic_id } = filter;
        this.builder.match({
            ...(title && { $text: { $search: title } }),
            ...(creator_id && { creator_id }),
            ...(topic_id && { topic_id }),
            ...(available_status && { available_status }),
            ...(type && { type }),
        });
        return this;
    }

    filterByTestId(testId) {
        this.builder.match({
            test_id: testId,
        });
        return this;
    }

    groupWithSentences() {
        this.builder.lookup({
            from: this.sentenceModel,
            localField: "list_sentence_ids",
            foreignField: "sentence_id",
            as: "sentences",
            mergeObject: false,
            single: false,
            removeFields: ["__v", "list_sentence_ids"],
        });
        return this;
    }

    sentenceIdsInRange({ start, limit }) {
        this.builder.aggregate({
            $addFields: {
                total_count: {
                    $size: "$list_sentence_ids",
                },
                list_sentence_ids: {
                    $slice: ["$list_sentence_ids", start, limit],
                },
            },
        });
        return this;
    }

    groupByTopic(queryFields: string[] = ["test_id", "title"]) {
        const projects = queryFields.reduce(
            (pre, cur) => Object.assign(pre, { [cur]: `$${cur}` }),
            {},
        );
        this.builder
            .aggregate({
                $group: {
                    _id: "$topic_id",
                    list_tests: {
                        $push: projects,
                    },
                },
            })
            .aggregate({
                $addFields: {
                    topic_id: "$_id",
                },
            })
            .lookup({
                from: this.topicModel,
                localField: "_id",
                foreignField: "topic_id",
                single: true,
                mergeObject: true,
                as: "topic",
                removeFields: ["__v"],
            })
            .sort({
                topic_order: 1,
            });
        return this;
    }

    groupWithTopic(localField = "topic_id", merge = true) {
        this.builder
            .lookup({
                from: this.topicModel,
                localField: localField,
                foreignField: "topic_id",
                single: true,
                mergeObject: merge,
                as: "topic",
                removeFields: ["__v"],
            })
            .sort({
                topic_order: 1,
            });

        return this;
    }

    totalScore(testId: string, defaultScore: number) {
        this.builder
            .match({
                test_id: testId,
            })
            .aggregate([
                {
                    $group: {
                        _id: "$test_id",
                        total_score: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$score", 0] },
                                    defaultScore,
                                    "$score",
                                ],
                            },
                        },
                        total_count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $project: {
                        test_id: "$_id",
                        total_score: 1,
                        total_count: 1,
                    },
                },
            ]);
        return this;
    }

    limit({ start, limit }) {
        this.builder.limit({ start, limit });
        return this;
    }

    sort({ sort_order, sort_by }) {
        this.builder.sort({
            [sort_by]: sort_order,
        });
        return this;
    }

    log() {
        return this.builder.log(console);
    }

    build() {
        return this.builder.build();
    }
}
