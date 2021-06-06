import { Exclude } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseModelSerializer, IsFile } from "src/lib/helpers";
import { FormFile } from "src/lib/types";
import { TemplateData } from "src/post/modules/core";

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
}

export class PostMetadataDTO extends BaseModelSerializer {
    @Exclude()
    content_file_id: string;

    @Exclude()
    thumbnail_file_id: string;

    content_file_url: string;

    thumbnail_file_url: string;

    templates: TemplateData[];
}
