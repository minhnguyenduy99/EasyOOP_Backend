import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AggregateBuilder, LimitOptions } from "src/lib/database/mongo";
import { Tag } from "src/tag";
import { PostMetadata, Topic } from "../models";

export interface PostFilterOptions {
    post_status?: number;
    keyword?: string;
    topic_id?: string;
}

@Injectable()
export class PostServiceExtender {
    constructor(
        @InjectModel(PostMetadata.name)
        private readonly postMetadataModel: Model<PostMetadata>,
        @InjectModel(Topic.name)
        private readonly topicModel: Model<Topic>,
        @InjectModel(Tag.name)
        private readonly tagModel: Model<Tag>,
    ) {}

    groupWithMetadata(builder: AggregateBuilder) {
        builder.lookup({
            from: this.postMetadataModel,
            localField: "post_metadata_id",
            foreignField: "_id",
            as: "post_metadata_id",
            single: true,
            removeFields: ["__v", "_id"],
            mergeObject: true,
        });
        return this;
    }

    groupWithTopic(builder: AggregateBuilder) {
        builder.lookup({
            from: this.topicModel,
            localField: "topic_id",
            foreignField: "_id",
            as: "topic",
            single: true,
            removeFields: ["__v", "_id", "first_post_id"],
            mergeObject: true,
        });
        return this;
    }

    groupWithTags(builder: AggregateBuilder) {
        builder.aggregate({
            $lookup: {
                from: this.tagModel.collection.name,
                localField: "tags",
                foreignField: "tag_id",
                as: "tags",
            },
        });
        return this;
    }

    filter(builder: AggregateBuilder, options: PostFilterOptions) {
        const { keyword = "", topic_id = null, post_status = null } = options;
        builder.match({
            ...(keyword && {
                $text: {
                    $search: keyword,
                },
            }),
        });
        if (post_status) {
            builder.match({ post_status });
        }
        if (topic_id) {
            builder.match({ topic_id: Types.ObjectId(topic_id) });
        }
        return this;
    }

    filterByTag(builder: AggregateBuilder, tagId: string) {
        builder
            .match({
                tags: tagId,
            })
            .lookup({
                from: this.tagModel,
                localField: "tags",
                foreignField: "tag_id",
                as: "tags",
            });

        return this;
    }

    limit(builder: AggregateBuilder, limitOptions: LimitOptions) {
        builder.limit(limitOptions);
        return this;
    }
}
