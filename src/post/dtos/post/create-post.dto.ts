import {
    IsNotEmpty,
    IsMongoId,
    IsIn,
    IsOptional,
    IsArray,
} from "class-validator";
import { IsFile } from "src/lib/helpers";
import { FormFile } from "src/lib/types";
import { PostTemplate } from "src/post/modules/core";

export class CreatePostDTO {
    @IsNotEmpty()
    post_title: string;

    @IsNotEmpty()
    @IsMongoId()
    topic_id: string;

    @IsNotEmpty()
    @IsIn(["series", "single"])
    post_type: string;

    @IsFile({
        extension: "md",
        validateOnFileWithNoExt: false,
    })
    content_file: FormFile;

    @IsFile({
        extension: "jpg",
        validateOnFileWithNoExt: false,
    })
    thumbnail_file: FormFile;

    @IsMongoId()
    @IsOptional()
    previous_post_id: string;

    @IsArray()
    @IsNotEmpty()
    tags: string[];

    author_id: string;

    templates: PostTemplate[];
}
