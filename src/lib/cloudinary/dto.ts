export class UploadFileOptions {
    resourceType?: string;
}

export class DeleteFileOptions {
    resource_type?: string;
}

export interface CloudinaryOutput {
    code: number;
    url?: string;
    public_id?: string;
    error?: string;
}
