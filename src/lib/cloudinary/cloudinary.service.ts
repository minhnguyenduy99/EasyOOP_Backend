import { Inject, Injectable } from "@nestjs/common";
import { v2 } from "cloudinary";
import { CLOUDINARY_MODULE_CONFIG } from "./consts";
import { CloudinaryOutput, DeleteFileOptions, UploadFileOptions } from "./dto";
import { CloudinaryModuleConfig } from "./interfaces";

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject(CLOUDINARY_MODULE_CONFIG)
        private readonly config: CloudinaryModuleConfig,
    ) {}

    get folder() {
        return this.config.folder;
    }

    async uploadFile(
        file: any,
        options: UploadFileOptions,
    ): Promise<CloudinaryOutput> {
        const { resourceType } = options;
        const { publicId, dataUri } = this.getFileInfo(file, resourceType);
        try {
            const response = await v2.uploader.upload(dataUri, {
                public_id: publicId,
                folder: this.folder,
                resource_type: resourceType,
            });
            return {
                code: 0,
                public_id: response.public_id,
                url: response.secure_url || response.url,
            };
        } catch (err) {
            return {
                code: -1,
                error: err,
            };
        }
    }

    async updateFile(
        publicId: string,
        file: any,
        options: UploadFileOptions,
    ): Promise<CloudinaryOutput> {
        const { resourceType } = options;
        const { buffer, mimetype } = file;
        const dataUri = this.getDataFromBuffer(buffer, mimetype);
        try {
            const response = await v2.uploader.upload(dataUri, {
                public_id: publicId,
                resource_type: resourceType,
            });
            return {
                code: 0,
                public_id: response.public_id,
                url: response.secure_url || response.url,
            };
        } catch (err) {
            return {
                code: -1,
                error: err,
            };
        }
    }

    async deleteBulkFiles(publicIds: string[]) {
        try {
            const response = await v2.api.delete_resources(publicIds);
            if (response.result === "ok") {
                return {
                    code: 0,
                };
            }
            return {
                code: -1,
            };
        } catch (err) {
            console.log(err);
            return {
                code: -2,
                error: err,
            };
        }
    }

    async deleteFile(
        publicId: string,
        options?: DeleteFileOptions,
    ): Promise<CloudinaryOutput> {
        options = options ?? {
            resource_type: "image",
        };
        try {
            const response = await v2.uploader.destroy(publicId, options);
            if (response.result === "ok") {
                return { code: 0 };
            }
            return {
                code: -1,
            };
        } catch (err) {
            return {
                code: -2,
                error: err,
            };
        }
    }

    protected getFileInfo(file, resourceType) {
        const { buffer, mimetype, originalname } = file;
        const dataUri = this.getDataFromBuffer(buffer, mimetype);
        const dotIndex = originalname.lastIndexOf(".");
        let ext, fileName: string;
        if (dotIndex === -1) {
            ext = null;
            fileName = originalname;
        } else {
            ext = `${originalname}`.slice(dotIndex + 1) || null;
            fileName = `${originalname}`.slice(
                0,
                dotIndex > 10 ? 10 : dotIndex,
            );
        }
        let publicId;
        fileName = fileName.replace(/\W/g, "_");
        publicId = fileName + "_" + Date.now(); // generate random name
        if (ext && resourceType === "raw") {
            publicId += `.${ext}`;
        }
        return {
            publicId,
            dataUri,
        };
    }

    protected getDataFromBuffer(buffer, mimeType) {
        const dataUriPrefix = `data:${mimeType};base64,`;
        return dataUriPrefix + buffer.toString("base64");
    }
}
