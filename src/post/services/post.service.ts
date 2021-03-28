import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model, Types } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { TAG_TYPES } from "../consts";
import {
    CommitActionResult,
    CreatePostDTO,
    LimitOptions,
    PaginatedResult,
    PostDTO,
    SortOptions,
    TagResult,
    UpdatePostDTO,
} from "../dtos";
import { POST_EVENTS } from "../events";
import { BaseLimiter, PostFilter, PostFilterOptions } from "../helpers";
import { Post, PostMetadata, Topic } from "../models";
import { PostMetadataService } from "./post-metadata.service";
import { Tag, TagType } from "src/tag";

export interface IPostService {
    createPost(dto: CreatePostDTO): Promise<CommitActionResult<Post>>;
    updatePost(
        postId: string,
        dto: UpdatePostDTO,
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
    getPostsByTag(tag: string[], limit?: LimitOptions): Promise<PostDTO[]>;
    deletePost(postId: string): Promise<CommitActionResult<void>>;
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
        private postFilter: PostFilter,
        private postLimiter: BaseLimiter,
        private eventEmitter: EventEmitter2,
    ) {}

    async getPosts(
        filterOptions: PostFilterOptions,
        limit?: LimitOptions,
        sort?: SortOptions,
    ) {
        const builder = new AggregateBuilder();

        builder.aggregate(this.postFilter.filter(filterOptions));
        builder.aggregate(this.postLimiter.limit(limit?.start, limit?.limit));
        builder.sort({
            [sort.field]: sort.asc ? 1 : -1,
        });

        const queryResult = await this.postModel
            .aggregate(builder.log(null).build())
            .exec();
        console.log(queryResult);
        const [{ results, count }] = queryResult;
        return {
            count,
            results,
        };
    }

    async createPost(dto: CreatePostDTO) {
        const [topic, post] = await Promise.all([
            this.topicModel.findById(dto.topic_id),
            (dto?.previous_post_id
                ? this.doesPostExist(dto.previous_post_id)
                : Promise.resolve(true)) as Promise<unknown>,
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
        const { content_file, thumbnail_file, ...postDTO } = dto;
        // Create post metadata
        const createMetaResult = await this.postMetadataService.create({
            content_file,
            thumbnail_file,
        });
        if (createMetaResult.error) {
            return {
                code: -3,
                error: createMetaResult.error,
            };
        }

        try {
            const inputDoc = {
                ...postDTO,
                post_metadata_id: createMetaResult.data._id,
                topic_id: topic._id,
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
            const error = err?.message ?? err ?? "Create post failed";
            return {
                code: -3,
                error,
            };
        }
    }

    updatePost(
        postId: string,
        dto: UpdatePostDTO,
    ): Promise<CommitActionResult<Post>> {
        throw new Error("Method not implemented.");
    }

    async getPostById(postId: string): Promise<any> {
        const builder = new AggregateBuilder();
        builder
            .match({
                _id: Types.ObjectId(postId),
            })
            .lookup({
                from: this.postMetadataModel,
                localField: "post_metadata_id",
                foreignField: "_id",
                as: "post_metadata_id",
                single: true,
                removeFields: ["__v", "_id"],
                mergeObject: true,
            })
            .lookup({
                from: this.topicModel,
                localField: "topic_id",
                foreignField: "_id",
                as: "topic",
                single: true,
                removeFields: ["__v", "_id", "first_post_id"],
                mergeObject: true,
            });
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
                _id: topic.first_post_id,
            })
            .aggregate({
                $facet: {
                    firstPost: [
                        {
                            $project: {
                                _id: 1,
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
                                connectToField: "_id",
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
                                _id: "$list_posts._id",
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
        return [firstPost].concat(nextPosts);
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

        return new (TagResult(PostDTO))(
            {
                tag_id: tagIds,
            },
            results,
        );
    }

    async deletePost(postId: string) {
        try {
            const result = await this.postModel.findByIdAndDelete(postId, {
                multipleCastError: true,
                useFindAndModify: false,
            });
            if (!result) {
                return {
                    code: -1,
                    error: "Invalid post ID",
                };
            }
            this.eventEmitter.emitAsync(POST_EVENTS.POST_DELETED, {
                post: result,
            });
            return {
                code: 0,
            };
        } catch (err) {
            console.error(err.stack);
            return {
                code: -2,
                error: err,
            };
        }
    }

    protected async doesPostExist(postId: string) {
        const post = await this.postModel.findById(postId, {
            _id: 1,
        });
        return post ?? false;
    }
}
