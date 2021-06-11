import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder, LimitOptions } from "src/lib/database/mongo";
import { Post, PostMetadata, POST_STATUSES, Topic } from "../../core";
import { VERIFICATION_STATUS } from "../consts";
import { GroupOptions, PostGroupOptions } from "./group-options.interface";

export const GROUP_TYPES = {
    post: "groupWithPosts",
    manager: "groupWithManager",
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

    groupWithManager(builder: AggregateBuilder) {
        builder.lookup({
            from: "managers",
            localField: "manager_id",
            foreignField: "role_id",
            as: "manager",
            mergeObject: true,
            removeFields: ["__v", "role_id", "user_id"],
        });
        return this;
    }

    groupWithPosts(builder: AggregateBuilder, options?: PostGroupOptions) {
        const {
            metadata = false,
            topic = false,
            tag = false,
            verificationStatus = VERIFICATION_STATUS.VERIFIED,
        } = options ?? {};

        let postFilter = null;

        switch (verificationStatus) {
            case VERIFICATION_STATUS.VERIFIED:
                postFilter = {
                    $or: [
                        { post_status: POST_STATUSES.ACTIVE },
                        { post_status: POST_STATUSES.PENDING_DELETED },
                    ],
                };
                break;
            case VERIFICATION_STATUS.CANCEL:
            case VERIFICATION_STATUS.PENDING:
                postFilter = {
                    post_status: { $ne: POST_STATUSES.ACTIVE },
                };
        }

        groupWithPosts(this.postModel, postFilter);

        metadata && groupWithMetadata(this.metadataModel);
        topic && groupWithTopic(this.topicModel);
        tag && groupWithTags();

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

        function groupWithPosts(postModel, filter) {
            return builder.lookup({
                from: postModel,
                localField: "post_id",
                foreignField: "post_id",
                ...(filter && {
                    pipeline: [
                        {
                            $match: filter,
                        },
                    ],
                }),
                removeFields: ["__v", "previous_post_id", "next_post_id"],
                single: true,
                as: "post",
            });
        }

        function groupWithTags() {
            return builder.lookup({
                from: "tags",
                localField: "post.tags",
                foreignField: "tag_id",
                removeFields: ["__v"],
                single: false,
                mergeObject: true,
                mergeOn: "post",
                as: "post.tags",
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
                            $or: [
                                { post_status: POST_STATUSES.ACTIVE },
                                { post_status: POST_STATUSES.PENDING_DELETED },
                            ],
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
                                $and: [
                                    {
                                        post_status: {
                                            $ne: POST_STATUSES.ACTIVE,
                                        },
                                    },
                                    {
                                        post_status: {
                                            $ne: POST_STATUSES.PENDING_DELETED,
                                        },
                                    },
                                ],
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

    groupByPostStatus(builder: AggregateBuilder) {
        builder.aggregate([
            {
                $group: {
                    _id: {
                        status: "$status",
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    status: 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id.status",
                    count: 1,
                },
            },
        ]);
        return this;
    }
}
