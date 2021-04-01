import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model, Types } from "mongoose";
import {
    AggregateBuilder,
    LimitOptions as MongoLimitOption,
} from "src/lib/database/mongo";
import { POST_STATUSES, TAG_TYPES } from "../consts";
import {
    CommitActionResult,
    CreatePostDTO,
    LimitOptions,
    PaginatedResult,
    PostWithTagDTO,
    SortOptions,
} from "../dtos";
import { POST_EVENTS } from "../events";
import { PostFilterOptions, PostServiceExtender } from "../helpers";
import { Post, PostMetadata, Topic } from "../models";
import { PostMetadataService } from "./post-metadata.service";
import { Tag, TagType } from "src/tag";
import { ERRORS } from "../errors";

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

    verifyDelete(postId: string): Promise<CommitActionResult<string>>;
    verifyCreate(postId: string): Promise<CommitActionResult<string>>;
    verifyUpdate(postId: string): Promise<CommitActionResult<string>>;
}

@Injectable()
export class PostService implements IPostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(Topic.name) private topicModel: Model<Topic>,
        @InjectModel(Tag.name) private tagModel: Model<Tag>,
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        private postMetadataService: PostMetadataService,
        private postExtender: PostServiceExtender,
        private eventEmitter: EventEmitter2,
        private logger: Logger,
    ) {}

    verifyDelete(postId: string): Promise<CommitActionResult<string>> {
        throw new Error("Method not implemented.");
    }

    verifyCreate(postId: string): Promise<CommitActionResult<string>> {
        throw new Error("Method not implemented.");
    }
    verifyUpdate(postId: string): Promise<CommitActionResult<string>> {
        throw new Error("Method not implemented.");
    }

    async getPosts(
        filterOptions: PostFilterOptions,
        limit?: LimitOptions,
        sort?: SortOptions,
    ) {
        const builder = new AggregateBuilder();
        this.postExtender
            .filter(builder, filterOptions)
            .groupWithTopic(builder)
            .groupWithTags(builder)
            .limit(builder, limit as MongoLimitOption);

        builder.sort({
            [sort.field]: sort.asc ? 1 : -1,
        });

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
        return this.innerCreatePost(dto, POST_STATUSES.ACTIVE);
    }

    async updatePost(
        postId: string,
        dto: CreatePostDTO,
    ): Promise<CommitActionResult<Post>> {
        const post = await this.postModel.findById(postId);
        if (!post) {
            return {
                code: -10,
                error: "Post not found",
            };
        }
        const createPostResult = await this.innerCreatePost(
            dto,
            POST_STATUSES.PENDING_UPDATED,
        );
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
            return {
                code: 0,
                data: postId,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    protected async innerCreatePost(
        dto: CreatePostDTO,
        postStatus: number,
    ): Promise<CommitActionResult<Post>> {
        const [topic, post, tagsValid] = await Promise.all([
            this.topicModel.findById(dto.topic_id),
            (dto?.previous_post_id
                ? this.doesPostExist(dto.previous_post_id)
                : Promise.resolve(true)) as Promise<unknown>,
            this.tagsValid(dto.tags),
        ]);
        if (!topic || !post) {
            if (!topic) {
                return {
                    code: -1,
                    error: "Topic is invalid",
                };
            } else {
                return {
                    code: -2,
                    error: "Previous post ID is invalid",
                };
            }
        }
        if (!tagsValid) {
            return {
                code: -3,
                error: "Tags are invalid",
            };
        }
        const { content_file, thumbnail_file, ...postDTO } = dto;
        // Create post metadata
        const createMetaResult = await this.postMetadataService.create({
            content_file,
            thumbnail_file,
        });
        if (createMetaResult.error) {
            return {
                code: -4,
                error: createMetaResult.error,
            };
        }

        try {
            const inputDoc = {
                ...postDTO,
                post_metadata_id: createMetaResult.data._id,
                topic_id: topic._id,
                post_status: postStatus,
            };
            const post = await this.postModel.create(inputDoc);
            this.eventEmitter.emitAsync(POST_EVENTS.POST_CREATED, {
                post,
                topic,
            });
            return {
                code: 0,
                data: post,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    protected async doesPostExist(postId: string) {
        const post = await this.postModel.findOne(
            {
                post_id: postId,
            },
            {
                post_id: 1,
            },
        );
        return post ?? false;
    }

    protected async tagsValid(tags: string[]) {
        // const foundTags = await this.tagModel.find({
        //     tag_id: {
        //         $in: tags,
        //     },
        // });
        // console.log(foundTags);
        // return foundTags.length === tags.length;
        return true;
    }
}
