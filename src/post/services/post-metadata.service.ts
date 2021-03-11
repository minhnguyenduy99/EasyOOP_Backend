import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CloudinaryService } from "src/lib/cloudinary";
import { AggregateBuilder } from "src/lib/database/mongo";
import { CommitActionResult, CreatePostMetadataDTO } from "../dtos";
import { PostMetadata, Topic } from "../models";

export interface IPostMetadataService {
    create(
        dto: CreatePostMetadataDTO,
    ): Promise<CommitActionResult<PostMetadata>>;
    getPostByTopic(topicId: string, page: number): Promise<any>;
}

@Injectable()
export class PostMetadataService implements IPostMetadataService {
    constructor(
        @InjectModel(Topic.name) private topicModel: Model<Topic>,
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        private fileUploader: CloudinaryService,
        private logger: Logger,
    ) {}

    async create(dto: CreatePostMetadataDTO) {
        const { content_file, thumbnail_file } = dto;
        const [uploadContentResult, uploadThumbnailResult] = await Promise.all([
            this.fileUploader.uploadFile(content_file, {
                resourceType: "raw",
            }),
            this.fileUploader.uploadFile(thumbnail_file, {
                resourceType: "image",
            }),
        ]);
        const isError =
            uploadContentResult.code == -1 || uploadThumbnailResult.code == -1;
        if (isError) {
            const uploadError =
                uploadContentResult.error || uploadThumbnailResult.error;
            return {
                code: -1,
                error: uploadError,
            };
        }

        const {
            public_id: contentFileId,
            url: contentFileURL,
        } = uploadContentResult;
        const {
            public_id: thumbnailFileId,
            url: thumbnailFileURL,
        } = uploadThumbnailResult;

        const inputDoc = {
            created_date: Date.now(),
            content_file_id: contentFileId,
            content_file_url: contentFileURL,
            thumbnail_file_id: thumbnailFileId,
            thumbnail_file_url: thumbnailFileURL,
        };

        try {
            const result = await this.postMetadataModel.create(inputDoc);
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger.error(err?.stack ?? err);
            return {
                code: -1,
                error: err?.message ?? err,
            };
        }
    }

    async getPostByTopic(topicId: string, page: number): Promise<any> {
        throw new InternalServerErrorException("Not implemented");
    }
}
