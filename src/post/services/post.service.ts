import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model, Types } from "mongoose";
import {
    AggregateBuilder,
    LimitOptions as MongoLimitOption,
} from "src/lib/database/mongo";
import { POST_STATUSES, TAG_TYPES } from "../modules/core/consts";
import {
    LimitOptions,
    PaginatedResult,
    PostWithTagDTO,
    SortOptions,
} from "../dtos";
import { POST_EVENTS } from "../events";
import {
    PostFilterOptions,
    PostServiceExtender,
    POST_ERRORS,
} from "../helpers";
import {
    Post,
    PostCoreService,
    PostMetadata,
    Topic,
    CreatePostDTO,
    CommitActionResult,
} from "../modules/core";
import { ERRORS } from "../modules/core";
import { Tag, TagService } from "src/tag";

export interface IPostService {
    createPost(dto: CreatePostDTO): Promise<CommitActionResult<Post>>;
    updatePost(
        postId: string,
        dto: CreatePostDTO,
    ): Promise<CommitActionResult<Post>>;
    getPosts(
        filter: PostFilterOptions,
        limit?: LimitOptions,
        sort?: SortOptions,
    ): Promise<PaginatedResult>;
    getPostById(postId: string, active?: boolean): Promise<Post>;
    getPostByTopic(
        topicId: string,
        limit?: LimitOptions,
        sort?: SortOptions,
    ): Promise<any>;
    getPostsByTag(
        tags: string[],
        limit?: LimitOptions,
    ): Promise<PostWithTagDTO>;
    getPostsGroupedByTopic(): Promise<any>;
    getLatestPostOfTopic(topicId: string): Promise<Post>;
    deletePost(postId: string): Promise<CommitActionResult<Post>>;
}

@Injectable()
export class PostService implements IPostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Topic.name) private topicModel: Model<Topic>,
        @InjectModel(Tag.name) private tagModel: Model<Tag>,
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        private postExtender: PostServiceExtender,
        private postCoreService: PostCoreService,
        private eventEmitter: EventEmitter2,
        private logger: Logger,
    ) {}

    async getPosts(
        filterOptions: PostFilterOptions,
        limit?: LimitOptions,
        sort?: SortOptions,
    ) {
        const builder = new AggregateBuilder();
        this.postExtender
            .filter(builder, filterOptions)
            .sort(sort, builder)
            .groupWithTopic(builder)
            .groupWithTags(builder)
            .groupWithMetadata(builder)
            .limit(builder, limit as MongoLimitOption);

        const queryResult = await this.postModel
            .aggregate(builder.log(null).build())
            .exec();

        const [{ results, count }] = queryResult;
        return {
            count,
            results,
        };
    }

    async createPost(dto: CreatePostDTO): Promise<CommitActionResult<Post>> {
        const post = await this.postCoreService.doesTopicHavePendingPost(
            dto.topic_id,
        );
        if (post) {
            return POST_ERRORS.PostIsPending;
        }
        dto.post_status = POST_STATUSES.PENDING_CREATED;
        const result = await this.postCoreService.createPost(dto);
        if (result.error) {
            return result;
        }
        this.eventEmitter.emitAsync(POST_EVENTS.POST_CREATED, {
            post: result.data,
        });
        return result;
    }

    async updatePendingPost(
        postId: string,
        dto: CreatePostDTO,
    ): Promise<CommitActionResult<Post>> {
        const post = await this.postCoreService.getPostById(postId);
        if (!post) {
            return POST_ERRORS.PostNotFound;
        }
        if (
            ![
                POST_STATUSES.PENDING_CREATED,
                POST_STATUSES.PENDING_UPDATED,
            ].includes(post.post_status)
        ) {
            return POST_ERRORS.InvalidPostStatus;
        }
        dto["post_id"] = postId;
        const [newPost] = await Promise.all([
            this.postCoreService.createPost(dto),
            this.postCoreService.destroyPost(post),
        ]);
        return newPost;
    }

    async updatePost(
        postId: string,
        dto: CreatePostDTO,
    ): Promise<CommitActionResult<Post>> {
        const post = await this.postModel.findOne({
            post_id: postId,
            post_status: POST_STATUSES.ACTIVE,
        });
        if (!post) {
            return POST_ERRORS.PostNotFound;
        }
        dto["post_id"] = postId;
        dto.post_status = POST_STATUSES.PENDING_UPDATED;
        if (dto.previous_post_id === post.previous_post_id) {
            dto.next_post_id = post.next_post_id;
        }
        const createPostResult = await this.postCoreService.createPost(dto);
        if (createPostResult.error) {
            return createPostResult;
        }
        this.eventEmitter.emitAsync(POST_EVENTS.POST_UPDATED, {
            post: createPostResult.data,
        });
        return createPostResult;
    }

    async getPostById(postId: string, active = true): Promise<any> {
        const builder = new AggregateBuilder();
        builder.match({
            post_id: postId,
        });
        this.postExtender
            .filterByActive(builder, active)
            .groupWithAdjacentPost(
                builder,
                { queryField: "previous_post_id", as: "previous_post" },
                { queryField: "next_post_id", as: "next_post" },
            )
            .groupWithMetadata(builder)
            .groupWithTopic(builder)
            .groupWithTags(builder);

        const [count, [result]] = await Promise.all([
            this.postModel
                .find({
                    post_id: postId,
                })
                .count()
                .exec(),
            this.postModel.aggregate(builder.build()).exec(),
        ]);
        result && (result.is_pending = count > 1);
        return result;
    }

    async getPostByTopic(topic: string | Topic): Promise<any> {
        typeof topic === "string" &&
            (topic = await this.topicModel.findById(topic));
        if (!topic) {
            return null;
        }
        const builder = new AggregateBuilder();
        builder
            .match({
                post_id: topic.first_post_id,
                post_status: POST_STATUSES.ACTIVE,
            })
            .aggregate({
                $facet: {
                    firstPost: [
                        {
                            $project: {
                                post_id: 1,
                                post_title: 1,
                            },
                        },
                    ],
                    nextPosts: [
                        {
                            $graphLookup: {
                                from: this.postModel.collection.name,
                                startWith: "$next_post_id",
                                connectFromField: "next_post_id",
                                connectToField: "post_id",
                                as: "list_posts",
                                depthField: "order",
                                restrictSearchWithMatch: {
                                    post_status: POST_STATUSES.ACTIVE,
                                },
                            },
                        },
                        {
                            $project: {
                                list_posts: 1,
                            },
                        },
                        {
                            $unwind: "$list_posts",
                        },
                        {
                            $sort: {
                                "list_posts.order": 1,
                            },
                        },
                        {
                            $project: {
                                post_id: "$list_posts.post_id",
                                post_title: "$list_posts.post_title",
                            },
                        },
                    ],
                },
            });
        let results = await this.postModel.aggregate(builder.build()).exec();
        let [{ firstPost, nextPosts }] = results;
        if (!firstPost || !firstPost?.length) {
            return {
                ...topic.toObject(),
                list_posts: [],
            };
        }
        firstPost = firstPost[0];
        return {
            ...topic.toObject(),
            list_posts: [firstPost].concat(nextPosts),
        };
    }

    async getLatestPostOfTopic(topicId: string): Promise<Post> {
        const topicIdInMongo = Types.ObjectId(topicId);
        const results = await this.postModel
            .find(
                {
                    topic_id: topicIdInMongo,
                    post_status: POST_STATUSES.ACTIVE,
                },
                {
                    post_id: 1,
                    post_title: 1,
                    created_date: 1,
                },
            )
            .sort({
                created_date: -1,
            })
            .limit(1);
        return results?.[0];
    }

    async getPostsGroupedByTopic(): Promise<any[]> {
        try {
            const listTopics = await this.topicModel
                .find()
                .sort({ topic_order: 1 });
            const results = [];
            for (const topic of listTopics) {
                const result = await this.getPostByTopic(topic);
                results.push(result);
            }
            return results;
        } catch (err) {
            this.logger.error(err, err.trace);
            return [];
        }
    }

    async getPostsByTag(
        tagIds: string[],
        limit?: LimitOptions,
        queryOptions: { withMeta: boolean } = {
            withMeta: true,
        },
    ) {
        const builder = new AggregateBuilder();
        builder
            .match({
                tags: {
                    $all: tagIds,
                },
            })
            .aggregate({
                $lookup: {
                    from: this.tagModel.collection.name,
                    as: "tags",
                    let: {
                        tags: "$tags",
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$tag_id", "$$tags"],
                                },
                            },
                        },
                    ],
                },
            });
        if (queryOptions.withMeta) {
            builder.lookup({
                from: this.postMetadataModel,
                localField: "post_metadata_id",
                foreignField: "_id",
                as: "post_metadata_id",
                single: true,
                removeFields: ["__v", "_id"],
                mergeObject: true,
            });
        }
        limit = limit ?? {
            start: 0,
            limit: 10,
        };
        builder.limit(limit as any);
        const queriedResult = await this.postModel.aggregate(builder.build());
        const [{ results }] = queriedResult;

        return {
            tags: tagIds,
            results,
        } as PostWithTagDTO;
    }

    async deletePost(postId: string): Promise<CommitActionResult<Post>> {
        const [
            activePost,
            pendingPost,
        ] = await this.postCoreService.getPostsWithAllVersions(postId);
        if (!activePost) {
            return POST_ERRORS.PostNotFound;
        }
        if (pendingPost) {
            return POST_ERRORS.PostIsPending;
        }
        activePost.post_status = POST_STATUSES.PENDING_DELETED;
        try {
            await activePost.save();
            this.eventEmitter.emitAsync(POST_EVENTS.POST_DELETED, {
                activePost,
            });
            return {
                code: 0,
                data: activePost,
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }
}
