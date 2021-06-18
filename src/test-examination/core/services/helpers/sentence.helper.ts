import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { TestExamination } from "../../models";
import { SentenceFilterOptions, TestFilter } from "../interfaces";

@Injectable()
export class SentenceServiceHelper {
    protected builder: AggregateBuilder;

    constructor(
        private logger: Logger,
        @InjectModel(TestExamination.name)
        private testModel: Model<TestExamination>,
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

    groupByTest() {
        this.builder
            .aggregate({
                $group: {
                    _id: "$test_id",
                    total_score: {
                        $sum: "$score",
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
