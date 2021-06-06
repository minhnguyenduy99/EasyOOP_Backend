import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AggregateBuilder, LimitOptions } from "src/lib/database/mongo";
import { Tag } from "src/tag";
import { SortOptions } from "../dtos";
import { Post, PostMetadata, Topic } from "../modules/core";

export interface PostFilterOptions {
    author_id?: string;
    post_status?: number;
    keyword?: string;
    topic_id?: string;
}

@Injectable()
export class PostServiceExtender {
    constructor(
        @InjectModel(Post.name)
        private readonly postModel: Model<Post>,
        @InjectModel(PostMetadata.name)
        private readonly postMetadataModel: Model<PostMetadata>,
        @InjectModel(Topic.name)
        private readonly topicModel: Model<Topic>,
        @InjectModel(Tag.name)
        private readonly tagModel: Model<Tag>,
    ) {}

    sort(options: SortOptions, builder: AggregateBuilder) {
        const { field, asc } = options;
        builder.sort({
            [field]: asc ? 1 : -1,
        });
        return this;
    }

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

    groupWithAdjacentPost(
        builder: AggregateBuilder,
        ...fields: { queryField: string; as: string }[]
    ) {
        fields.forEach((field) => {
            builder.lookup({
                from: this.postModel,
                localField: field.queryField,
                foreignField: "post_id",
                single: true,
                mergeObject: false,
                as: field.as,
                pipeline: [
                    {
                        $project: {
                            post_id: 1,
                            post_title: 1,
                        },
                    },
                ],
                removeFields: ["_id", "__v"],
            });
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
        const {
            keyword = "",
            topic_id = null,
            post_status = null,
            author_id = null,
        } = options;
        builder.match({
            ...(keyword && {
                $text: {
                    $search: keyword,
                },
            }),
            ...(author_id && { author_id }),
        });
        if (post_status !== -1) {
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
