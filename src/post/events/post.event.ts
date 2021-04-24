import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CloudinaryService } from "src/lib/cloudinary";
import { Post, PostMetadata, Topic } from "../modules/core";

@Injectable()
export class PostEvents {
    constructor(
        private fileUploader: CloudinaryService,
        @InjectModel(Post.name)
        private postModel: Model<Post>,
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        @InjectModel(Topic.name)
        private topicModel: Model<Topic>,
    ) {}
}
