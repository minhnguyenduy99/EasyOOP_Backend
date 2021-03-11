import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder, MongoErrors } from "src/lib/database/mongo";
import {
    CommitActionResult,
    CreateTopicDTO,
    LimitOptions,
    PaginatedResult,
    UpdateTopicDTO,
} from "../dtos";
import { BaseLimiter } from "../helpers";
import { Post, Topic } from "../models";

export interface ITopicService {
    createTopic(dto: CreateTopicDTO): Promise<CommitActionResult<Topic>>;
    updateTopic(
        topicId: string,
        dto: UpdateTopicDTO,
    ): Promise<CommitActionResult<Topic>>;
    searchTopic(
        keyword: string,
        limit?: LimitOptions,
    ): Promise<PaginatedResult>;
}

@Injectable()
export class TopicService implements ITopicService {
    constructor(
        @InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
        @InjectModel(Post.name) private readonly postModel: Model<Post>,
        private readonly logger: Logger,
        private readonly limiter: BaseLimiter,
    ) {}

    async createTopic(dto: CreateTopicDTO): Promise<CommitActionResult<Topic>> {
        const { topic_title } = dto;
        try {
            const topic = await this.topicModel.create({
                topic_title,
                first_post_id: null,
            });
            return {
                code: 0,
                data: topic,
            };
        } catch (err) {
            if (MongoErrors.isDuplicateKeyError(err)) {
                return {
                    code: -1,
                    error: "Topic title exist",
                };
            }
            return {
                code: -2,
                error: "Internal server error",
            };
        }
    }

    async updateTopic(topicId: string, dto: UpdateTopicDTO) {
        const { topic_title } = dto;
        try {
            const topic = await this.topicModel.findByIdAndUpdate(
                topicId,
                {
                    topic_title,
                },
                {
                    upsert: false,
                    multipleCastError: true,
                    useFindAndModify: false,
                },
            );
            if (!topic) {
                return {
                    code: -1,
                    error: "Topic ID not found",
                };
            }
            return {
                code: 0,
                data: topic,
            };
        } catch (err) {
            if (MongoErrors.isDuplicateKeyError(err)) {
                return {
                    code: -2,
                    error: "Topic title has already existed",
                };
            }
            return {
                code: -3,
                error: "Internal server error",
            };
        }
    }

    async searchTopic(keyword: string, limiter?: LimitOptions) {
        const { start, limit } = limiter;
        const builder = new AggregateBuilder();
        const regex = RegExp(`${keyword}`, "gi");
        builder
            .aggregate({
                $group: {
                    _id: "$topic_id",
                    post_count: { $sum: 1 },
                },
            })
            .lookup({
                from: this.topicModel,
                localField: "_id",
                foreignField: "_id",
                as: "topic",
                pipeline: [
                    {
                        $match: {
                            topic_title: {
                                $regex: regex,
                            },
                        },
                    },
                ],
                outer: false,
                single: true,
                mergeObject: true,
                removeFields: ["__v"],
            })
            .aggregate(this.limiter.limit(start, limit));

        const queriedResult = await this.postModel
            .aggregate(builder.log(null).build())
            .exec();
        const [{ count, results }] = queriedResult;
        return {
            count,
            results,
        };
    }
}
