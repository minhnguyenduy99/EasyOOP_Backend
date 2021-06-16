import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CloudinaryService } from "src/lib/cloudinary";
import { POST_ERRORS } from "src/post/helpers";
import { POST_STATUSES } from "../consts";
import { CommitActionResult, CreatePostDTO } from "../dtos";
import { ERRORS } from "../errors";
import { Post, PostMetadata, Topic } from "../models";
import { PostMetadataService } from "./post-metadata.service";

@Injectable()
export class PostCoreService {
    constructor(
        @InjectModel(Post.name)
        private postModel: Model<Post>,
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        @InjectModel(Topic.name)
        private topicModel: Model<Topic>,
        private fileUploader: CloudinaryService,
        private postMetadataService: PostMetadataService,
        private logger: Logger,
    ) {}

    async getPostById(postId: string, active = true) {
        return this.findPostById(postId, active);
    }

    async getPostsWithAllVersions(postId: string) {
        return this.postModel.find(
            {
                post_id: postId,
            },
            {},
            {
                sort: {
                    post_status: 1,
                },
            },
        );
    }

    async activatePost(postOrpostId: string | Post) {
        let post = postOrpostId as Post;
        if (typeof postOrpostId === "string") {
            post = await this.findPostById(postOrpostId, false);
        }
        if (!post) {
            return false;
        }
        const initialState = post.post_status;
        post.post_status = POST_STATUSES.ACTIVE;
        try {
            await post.save();
            if (initialState === POST_STATUSES.PENDING_DELETED) {
                return true;
            }
            await this.onPostCreated(post);
            return true;
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

    async updateLatestVersionOfPost(postId: string) {
        const [currentPost, updatedPost] = await this.getPostsWithAllVersions(
            postId,
        );
        if (!currentPost) {
            return POST_ERRORS.PostNotFound;
        }
        if (!updatedPost) {
            return POST_ERRORS.InvalidPostStatus;
        }
        try {
            await this.destroyPost(currentPost);
            await this.activatePost(updatedPost);
            return {
                code: 0,
                data: updatedPost,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async doesTopicHavePendingPost(topicId: string) {
        const post = await this.postModel.findOne(
            {
                topic_id: Types.ObjectId(topicId),
                post_status: {
                    $ne: POST_STATUSES.ACTIVE,
                },
            },
            {
                post_id: 1,
            },
        );
        return post;
    }

    async destroyPost(postIdOrPost: string | Post): Promise<boolean> {
        let post = await this.innerDestroyPost(postIdOrPost, {
            isActive: false,
        });
        if (!post) {
            return post as boolean;
        }
        await this.onPostDestroyed(post);
        return true;
    }

    async destroyInactivePost(postIdOrPost: string | Post): Promise<boolean> {
        let post = await this.innerDestroyPost(postIdOrPost, {
            isActive: false,
        });
        if (!post) {
            return post as boolean;
        }
        return true;
    }

    async createPost(dto: CreatePostDTO): Promise<CommitActionResult<Post>> {
        const [topic, previousPost, tagsValid] = await Promise.all([
            this.topicModel.findById(dto.topic_id),
            dto.previous_post_id
                ? this.findPostById(dto.previous_post_id)
                : (Promise.resolve(false) as Promise<any>),
            this.tagsValid(dto.tags),
        ]);
        if (!topic || previousPost === null) {
            if (!topic) {
                return POST_ERRORS.InvalidTopic;
            }
            return POST_ERRORS.InvalidPreviousPost;
        }
        if (!tagsValid) {
            return POST_ERRORS.InvalidTags;
        }
        const { content_file, thumbnail_file, templates, ...postDTO } = dto;
        // Create post metadata
        const createMetaResult = await this.postMetadataService.create({
            content_file,
            thumbnail_file,
            templates,
        });
        if (createMetaResult.error) {
            this.logger.error(createMetaResult.error);
            return POST_ERRORS.ServiceError;
        }

        if (postDTO.next_post_id === undefined) {
            postDTO.next_post_id = previousPost
                ? previousPost.next_post_id // not the first post
                : topic.first_post_id; // the first post
        }

        try {
            const inputDoc = {
                ...postDTO,
                post_metadata_id: createMetaResult.data._id,
                topic_id: topic._id,
            };
            const post = await this.postModel.create(inputDoc);
            return {
                code: 0,
                data: post,
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }

    protected async innerDestroyPost(
        postOrPostId: string | Post,
        options: any = {},
    ) {
        const { isActive = true } = options ?? {};
        let post = postOrPostId as Post;
        if (typeof postOrPostId === "string") {
            post = await this.findPostById(postOrPostId, isActive);
        }
        if (!post) {
            return false;
        }
        try {
            const [, postMetdata] = await Promise.all([
                post.delete(),
                this.postMetadataModel.findByIdAndDelete(post.post_metadata_id),
            ]);
            Promise.all([
                this.fileUploader.deleteFile(postMetdata.content_file_id, {
                    resource_type: "raw",
                }),
                this.fileUploader.deleteFile(postMetdata.thumbnail_file_id),
            ]).then((results) => {
                results.forEach(({ code, public_id }) => {
                    code &&
                        this.logger.error(
                            "Error when deleting file: " + public_id,
                        );
                });
            });
            return post;
        } catch (err) {
            this.logger.error(err);
            return false;
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

    protected async onPostCreated(post: Post) {
        this.logger.verbose("POST CREATION VERIFIED");
        const topic = await this.topicModel.findById(post.topic_id);
        const previousPost = await this.findPostById(
            post.previous_post_id ?? topic.first_post_id,
        );
        // Add to first and update first post id of topic
        if (!post.previous_post_id) {
            topic.first_post_id = post.post_id;
            await Promise.all([
                topic.save(),
                this.addFirst(previousPost, post),
            ]);
            return;
        }
        const nextPost = await this.postModel.findOne({
            post_id: post.next_post_id,
        });
        // Add last
        if (!nextPost) {
            await this.addLast(previousPost, post);
            return;
        }
        await this.addBetween(previousPost, nextPost, post);
    }

    protected async onPostDestroyed(post: Post) {
        this.logger.verbose("POST DELETION VERIFIED");
        // First post of topic
        if (!post.previous_post_id) {
            await this.removeFirst(post);
            return;
        }
        // Last post of topic
        if (!post.next_post_id) {
            this.removeLast(post);
            return;
        }
        await this.removeBetween(post);
    }

    protected async findPostById(postId: string, isActive = true) {
        return this.postModel.findOne({
            post_id: postId,
            post_status: isActive
                ? { $eq: POST_STATUSES.ACTIVE }
                : { $ne: POST_STATUSES.ACTIVE },
        });
    }

    private async addBetween(first: Post, last: Post, post: Post) {
        first.next_post_id = post.post_id;
        post.previous_post_id = first.post_id;
        post.next_post_id = last.post_id;
        last.previous_post_id = post.post_id;
        await Promise.all([first.save(), post.save(), last.save()]);
    }

    private async removeFirst(post: Post) {
        const nextPost = await this.findPostById(post.next_post_id);
        nextPost && (nextPost.previous_post_id = null);
        await Promise.all([
            nextPost?.save(),
            this.topicModel.updateOne(
                {
                    _id: post.topic_id,
                },
                {
                    first_post_id: nextPost ? nextPost.post_id : null,
                },
            ),
        ]);
    }

    private async removeLast(post: Post) {
        const previousPost = await this.findPostById(post.previous_post_id);
        if (!previousPost) {
            await this.topicModel.updateOne(
                {
                    _id: post.topic_id,
                },
                {
                    first_post_id: null,
                },
            );
            return;
        }
        previousPost.next_post_id = null;
        await previousPost.save();
    }

    private async removeBetween(post: Post) {
        const [previousPost, nextPost] = await Promise.all([
            this.findPostById(post.previous_post_id),
            this.findPostById(post.next_post_id),
        ]);
        previousPost.next_post_id = nextPost.post_id;
        nextPost.previous_post_id = previousPost.post_id;
        await Promise.all([previousPost.save(), nextPost.save()]);
    }

    private async addFirst(first: Post, post: Post) {
        post.previous_post_id = null;
        if (!first) {
            post.next_post_id = null;
            await post.save();
            return;
        }
        first.previous_post_id = post.post_id;
        post.next_post_id = first.post_id;
        await Promise.all([first.save(), post.save()]);
    }

    private async addLast(last: Post, post: Post) {
        post.next_post_id = null;
        if (!last) {
            post.previous_post_id = null;
            await post.save();
            return;
        }
        last.next_post_id = post.post_id;
        post.previous_post_id = last.post_id;
        await Promise.all([last.save(), post.save()]);
    }
}
