import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder, LimitOptions } from "src/lib/database/mongo";
import { Post, PostMetadata, POST_STATUSES, Topic } from "../../core";
import { GroupOptions, PostGroupOptions } from "./group-options.interface";

export const GROUP_TYPES = {
    post: "groupWithPosts",
};

@Injectable()
export class VerificationHelper {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(PostMetadata.name)
        private metadataModel: Model<PostMetadata>,
        @InjectModel(Topic.name)
        private topicModel: Model<Topic>,
    ) {}

    limit(builder: AggregateBuilder, limitOptions: LimitOptions) {
        builder.limit(limitOptions);
        return this;
    }

    sort(builder: AggregateBuilder, { sortField, sortOrder }: any) {
        builder.sort({
            [sortField]: sortOrder === "asc" ? 1 : -1,
        });
        return this;
    }

    filter(
        builder: AggregateBuilder,
        {
            authorId = null,
            managerId = null,
            type = null,
            status = null,
            search = null,
        },
    ) {
        builder.match({
            ...(search && { $text: { $search: search } }),
            ...(authorId && { author_id: authorId }),
            ...(managerId && { manager_id: managerId }),
            ...(type && { type }),
            ...((status || status === 0) && { status }),
        });
        return this;
    }

    group(builder: AggregateBuilder, groups: GroupOptions[] | GroupOptions) {
        let handlers = [];
        if (groups?.["type"] === "all") {
            handlers = Object.values(GROUP_TYPES).map((functionName) =>
                this?.[functionName].bind(this),
            );
        } else {
            const validGroups = (groups as GroupOptions[]).filter(
                (group) => GROUP_TYPES[group.type] && true,
            );
            handlers = validGroups.map((group) => {
                let functionName = GROUP_TYPES[group.type];
                return () => this?.[functionName]?.(builder, group.options);
            });
        }
        handlers.forEach((handler) => handler());
        return this;
    }

    groupWithPosts(builder: AggregateBuilder, options?: PostGroupOptions) {
        const {
            metadata = false,
            topic = false,
            postStatus = POST_STATUSES.ACTIVE,
        } = options ?? {};
        if (postStatus === POST_STATUSES.ACTIVE) {
            groupWithActivePost(this.postModel);
        } else {
            groupWithInactivePost(this.postModel);
        }
        if (metadata) {
            groupWithMetadata(this.metadataModel);
        }
        if (topic) {
            groupWithTopic(this.topicModel);
        }
        return this;

        function groupWithTopic(topicModel) {
            return builder.lookup({
                from: topicModel,
                localField: "post.topic_id",
                foreignField: "_id",
                as: "post.topic",
                mergeObject: true,
                single: true,
                mergeOn: "post",
                removeFields: ["__v", "first_post_id"],
            });
        }

        function groupWithMetadata(metadataModel) {
            builder.lookup({
                from: metadataModel,
                localField: "post.post_metadata_id",
                foreignField: "_id",
                as: "post.post_metadata",
                mergeObject: true,
                single: true,
                mergeOn: "post",
                removeFields: ["__v"],
            });
        }

        function groupWithPosts(postModel) {
            return builder.lookup({
                from: postModel,
                localField: "post_id",
                foreignField: "post_id",
                removeFields: ["__v", "previous_post_id", "next_post_id"],
                single: true,
                as: "post",
            });
        }

        function groupWithActivePost(postModel) {
            return builder.lookup({
                from: postModel,
                localField: "post_id",
                foreignField: "post_id",
                pipeline: [
                    {
                        $match: {
                            post_status: POST_STATUSES.ACTIVE,
                        },
                    },
                ],
                removeFields: ["__v", "previous_post_id", "next_post_id"],
                single: true,
                as: "post",
            });
        }

        function groupWithInactivePost(postModel) {
            return builder
                .lookup({
                    from: postModel,
                    localField: "post_id",
                    foreignField: "post_id",
                    pipeline: [
                        {
                            $match: {
                                post_status: {
                                    $ne: POST_STATUSES.ACTIVE,
                                },
                            },
                        },
                    ],
                    removeFields: ["__v", "previous_post_id", "next_post_id"],
                    single: false,
                    as: "post",
                })
                .aggregate({
                    $unwind: {
                        path: "$post",
                        preserveNullAndEmptyArrays: true,
                    },
                });
        }
    }
}
