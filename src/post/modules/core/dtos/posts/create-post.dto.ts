import {
    IsNotEmpty,
    IsMongoId,
    IsIn,
    IsOptional,
    IsArray,
    IsEmpty,
} from "class-validator";
import { Transform } from "class-transformer";
import { IsFile } from "src/lib/helpers";
import { FormFile } from "src/lib/types";
import { PostTemplate } from "./post-metadata.dto";

export class CreatePostDTO {
    @IsNotEmpty()
    post_title: string;

    @IsNotEmpty()
    @IsMongoId()
    topic_id: string;

    @IsNotEmpty()
    @IsIn(["series", "single"])
    post_type: string;

    @IsEmpty()
    post_status?: number;

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

    @Transform(({ value }) => {
        return value ?? false;
    })
    @IsNotEmpty()
    previous_post_id: string;

    @IsArray()
    @IsNotEmpty()
    tags: string[];

    templates: PostTemplate[];

    post_id?: string;

    next_post_id?: string;
}
