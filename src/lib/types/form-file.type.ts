export interface FormFile {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    size?: number;
    buffer?: Buffer;
}
