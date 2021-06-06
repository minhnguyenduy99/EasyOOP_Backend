import { Exclude } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { BaseModelSerializer, IsFile } from "src/lib/helpers";
import { FormFile } from "src/lib/types";

export class CreatePostMetadataDTO {
    @IsFile({
        extension: "md",
        validateOnFileWithNoExt: false,
    })
    @IsNotEmpty()
    content_file: FormFile;

    @IsFile({
        extension: "jpg",
        validateOnFileWithNoExt: true,
    })
    @IsNotEmpty()
    thumbnail_file: FormFile;

    @IsOptional()
    @IsArray()
    templates?: PostTemplate[];
}

export class PostMetadataDTO extends BaseModelSerializer {
    @Exclude()
    content_file_id: string;

    @Exclude()
    thumbnail_file_id: string;

    content_file_url: string;

    thumbnail_file_url: string;

    templates?: PostTemplate[];
}

export interface PostTemplate {
    type: string;
    title: string;
    tag?: string;
    class?: string;
    template_data: TemplateData[];
}

export interface TemplateData {
    data_title: string;
    data_link: string;
    // other keys for future use
    [key: string]: any;
}
