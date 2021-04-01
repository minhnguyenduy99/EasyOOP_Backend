import { OnEvent } from "@nestjs/event-emitter";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model } from "mongoose";
import { CloudinaryService } from "src/lib/cloudinary";
import { Post, PostMetadata, Topic } from "../models";
import { POST_EVENTS } from "./consts";
import { OnPostCreatedDTO, OnPostDeleted } from "./post-events.dto";

export class PostEvents {
    constructor(
        @InjectModel(Post.name) private postModel: Model<Post>,
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        @InjectModel(Topic.name)
        private topicModel: Model<Topic>,
        private fileUploader: CloudinaryService,
    ) {}

    @OnEvent(POST_EVENTS.POST_CREATED, { async: true })
    async onPostCreated(info: OnPostCreatedDTO) {
        const { post, topic } = info;
        const firstPost = await this.postModel.findOne({
            post_id: post.previous_post_id ?? topic.first_post_id,
        });
        // Add to first and update first post id of topic
        if (!post.previous_post_id) {
            topic.first_post_id = post._id;
            await Promise.all([this.addFirst(firstPost, post), topic.save()]);
            return;
        }
        const nextPost = await this.postModel.findById(firstPost.next_post_id);
        // Add last
        if (!nextPost) {
            await this.addLast(firstPost, post);
            return;
        }
        await this.addBetween(firstPost, nextPost, post);
    }

    @OnEvent(POST_EVENTS.POST_DELETED, { async: true })
    async onPostDeleted(info: OnPostDeleted) {
        const { post } = info;
        const [postMetadata] = await Promise.all([
            this.postMetadataModel.findById(post.post_metadata_id),
        ]);
        let updatePostOrder = null;
        // First post of topic
        if (!post.previous_post_id) {
            updatePostOrder = this.removeFirst(post);
        } else {
            if (!post.next_post_id) {
                updatePostOrder = this.removeLast(post);
            } else {
                updatePostOrder = this.removeBetween(post);
            }
        }

        await Promise.all([
            updatePostOrder,
            postMetadata.remove(),
            this.fileUploader.deleteFile(postMetadata.thumbnail_file_id),
            this.fileUploader.deleteFile(postMetadata.content_file_id, {
                resource_type: "raw",
            }),
        ]);
    }

    protected async removeFirst(post: Post) {
        const nextPost = await this.postModel.findById(post.next_post_id);
        if (!nextPost) {
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
        nextPost.previous_post_id = null;
        await nextPost.save();
    }

    protected async removeLast(post: Post) {
        const previousPost = await this.postModel.findById(
            post.previous_post_id,
        );
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

    protected async removeBetween(post: Post) {
        const [previousPost, nextPost] = await Promise.all([
            this.postModel.findById(post.previous_post_id),
            this.postModel.findById(post.next_post_id),
        ]);
        previousPost.next_post_id = nextPost._id;
        nextPost.previous_post_id = previousPost._id;
        await Promise.all([previousPost.save(), nextPost.save()]);
    }

    protected async addFirst(first: Post, post: Post) {
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

    protected async addLast(last: Post, post: Post) {
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

    protected async addBetween(first: Post, last: Post, post: Post) {
        first.next_post_id = post.post_id;
        post.previous_post_id = first.post_id;
        post.next_post_id = last.post_id;
        last.previous_post_id = post.post_id;
        await Promise.all([first.save(), post.save(), last.save()]);
    }
}
