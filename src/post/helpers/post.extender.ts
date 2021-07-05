import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { AggregateBuilder, LimitOptions } from "src/lib/database/mongo";
import { Tag } from "src/tag";
import { SortOptions } from "../dtos";
import {
    Post,
    PostMetadata,
    POST_STATUSES,
    TAG_TYPES,
    Topic,
} from "../modules/core";

export interface PostFilterOptions {
    author_id?: string;
    post_status?: number;
    keyword?: string;
    topic_id?: string;
    tags?: string[];
    tagSearchType?: number;
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

    filterByActive(builder: AggregateBuilder, active = true) {
        const match = active
            ? { post_status: POST_STATUSES.ACTIVE }
            : { post_status: { $ne: POST_STATUSES.ACTIVE } };
        builder.match(match);
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
        builder.lookup({
            from: this.tagModel,
            localField: "tags",
            foreignField: "tag_id",
            pipeline: [
                {
                    $match: {
                        tag_type: TAG_TYPES.post,
                    },
                },
            ],
            single: false,
            as: "tags",
            removeFields: ["__v"],
        });
        return this;
    }

    filter(builder: AggregateBuilder, options: PostFilterOptions) {
        const {
            keyword = "",
            topic_id = null,
            post_status = null,
            author_id = null,
            tags = [],
            tagSearchType = 0,
        } = options;
        builder.match({
            ...(keyword && {
                $text: {
                    $search: keyword,
                },
            }),
            ...(author_id && { author_id }),
        });
        this.filterByTags(builder, tags, tagSearchType);
        if (post_status !== -1) {
            builder.match({ post_status });
        }
        if (topic_id) {
            builder.match({ topic_id: Types.ObjectId(topic_id) });
        }
        return this;
    }

    filterByTags(
        builder: AggregateBuilder,
        tagIds: string[],
        tagSearchType?: number,
    ) {
        console.log(tagIds);
        if (!tagIds || tagIds.length === 0) {
            return;
        }
        const search = tagSearchType === 0 ? { $all: tagIds } : { $in: tagIds };
        builder.match({
            tags: search,
        });

        return this;
    }

    limit(builder: AggregateBuilder, limitOptions: LimitOptions) {
        builder.limit(limitOptions);
        return this;
    }
}
