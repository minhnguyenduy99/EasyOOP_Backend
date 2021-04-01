import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CloudinaryService } from "src/lib/cloudinary";
import { CommitActionResult, CreatePostMetadataDTO } from "../dtos";
import { ERRORS } from "../errors";
import { PostMetadata } from "../models";

export interface IPostMetadataService {
    create(
        dto: CreatePostMetadataDTO,
    ): Promise<CommitActionResult<PostMetadata>>;
    delete(postMetadataId: string): Promise<CommitActionResult<string>>;
}

@Injectable()
export class PostMetadataService implements IPostMetadataService {
    constructor(
        @InjectModel(PostMetadata.name)
        private postMetadataModel: Model<PostMetadata>,
        private fileUploader: CloudinaryService,
        private logger: Logger,
    ) {}

    async create(
        dto: CreatePostMetadataDTO,
    ): Promise<CommitActionResult<PostMetadata>> {
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
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async delete(postMetadataId: string): Promise<CommitActionResult<string>> {
        const metadata = await this.postMetadataModel.findById(postMetadataId);
        if (!metadata) {
            return {
                code: -1,
                error: "Post metadata not found",
            };
        }
        const { thumbnail_file_id, content_file_id } = metadata;
        try {
            await Promise.all([
                this.fileUploader.deleteFile(thumbnail_file_id),
                this.fileUploader.deleteFile(content_file_id),
                metadata.delete(),
            ]);
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }
}
