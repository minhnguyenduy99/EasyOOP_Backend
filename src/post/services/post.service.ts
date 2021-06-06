import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model } from "mongoose";
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
import { PostFilterOptions, PostServiceExtender } from "../helpers";
import {
    Post,
    PostCoreService,
    PostMetadata,
    Topic,
    CreatePostDTO,
    CommitActionResult,
} from "../modules/core";
import { ERRORS } from "../modules/core";
import { Tag } from "src/tag";

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
    getPostById(postId: string): Promise<Post>;
    getPostByTopic(
        topicId: string,
        limit?: LimitOptions,
        sort?: SortOptions,
    ): Promise<any>;
    getPostsByTag(
        tags: string[],
        limit?: LimitOptions,
    ): Promise<PostWithTagDTO>;
    deletePost(postId: string): Promise<CommitActionResult<string>>;
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
            return {
                code: -7,
                error: "Topic currently has pending post",
            };
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

    async updatePendingPost(postId: string, dto: CreatePostDTO) {
        const post = await this.postCoreService.getPostById(postId);
        if (!post) {
            return {
                code: -1,
                error: "Post not found",
            };
        }
        if (
            ![
                POST_STATUSES.PENDING_CREATED,
                POST_STATUSES.PENDING_UPDATED,
            ].includes(post.post_status)
        ) {
            return {
                code: -2,
                error: "Post status is invalid",
            };
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
            return {
                code: -10,
                error: "Post not found",
            };
        }
        dto["post_id"] = postId;
        dto.post_status = POST_STATUSES.PENDING_UPDATED;
        const createPostResult = await this.postCoreService.createPost(dto);
        if (createPostResult.error) {
            return createPostResult;
        }
        this.eventEmitter.emitAsync(POST_EVENTS.POST_UPDATED, {
            post: createPostResult.data,
        });
        return createPostResult;
    }

    async getPostById(postId: string): Promise<any> {
        const builder = new AggregateBuilder();
        builder.match({
            post_id: postId,
        });
        this.postExtender
            .groupWithAdjacentPost(
                builder,
                { queryField: "previous_post_id", as: "previous_post" },
                { queryField: "next_post_id", as: "next_post" },
            )
            .groupWithMetadata(builder)
            .groupWithTopic(builder)
            .groupWithTags(builder);

        const result = await this.postModel.aggregate(builder.build()).exec();
        return result?.[0];
    }

    async getPostByTopic(topicId: string): Promise<any> {
        const topic = await this.topicModel.findById(topicId);
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
            return [];
        }
        firstPost = firstPost[0];
        return {
            ...topic.toObject(),
            list_posts: [firstPost].concat(nextPosts),
        };
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

    async deletePost(postId: string) {
        const post = await this.postModel.findOne({
            post_id: postId,
        });
        if (!post) {
            return {
                code: -1,
                error: "Post not found",
            };
        }
        post.post_status = POST_STATUSES.PENDING_DELETED;
        try {
            await post.save();
            this.eventEmitter.emitAsync(POST_EVENTS.POST_DELETED, {
                post,
            });
            return {
                code: 0,
                data: postId,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }
}
