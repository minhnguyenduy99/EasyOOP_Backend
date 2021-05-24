import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { Sentence } from "../models";
import { TestFilter } from "./interfaces";

@Injectable()
export class ServiceHelper {
    protected builder: AggregateBuilder;

    constructor(
        private logger: Logger,
        @InjectModel(Sentence.name) private sentenceModel: Model<Sentence>,
    ) {
        this.builder = new AggregateBuilder();
    }

    filter(filter: TestFilter) {
        const { title, creator_id, verifying_status, type } = filter;
        this.builder.match({
            ...(title && { $text: { $search: title } }),
            ...(creator_id && { creator_id }),
            ...(verifying_status && { verifying_status }),
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

    getWithTotalScore() {
        this.builder
            .lookup({
                from: this.sentenceModel,
                localField: "list_sentence_ids",
                foreignField: "sentence_id",
                as: "sentences",
                mergeObject: false,
                single: false,
                removeFields: ["__v", "options", "question", "answer"],
            })
            .aggregate({
                $addFields: {
                    total_score: {
                        $sum: "$sentences.score",
                    },
                },
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
