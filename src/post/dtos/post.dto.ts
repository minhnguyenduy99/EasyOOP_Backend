import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsIn, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import {
    BaseModelSerializer,
    BasePaginationSerializer,
    IsFile,
} from "src/lib/helpers";
import { SerializerOptions } from "src/lib/helpers/serializers/base-pagination.serializer";
import { FormFile } from "src/lib/types";
import { Topic } from "../models";
import { PostMetadataDTO } from "./post-metadata.dto";

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
}

export class UpdatePostDTO extends CreatePostDTO {}

export class GetPostsDTO {
    @IsOptional()
    @Transform(({ value }) => value ?? "")
    search?: string;

    @IsOptional()
    sort_by?: string;

    @IsOptional()
    @IsIn(["asc", "desc"])
    sort_order?: string;
}

export class PaginatedPostDTO extends BasePaginationSerializer<PostDTO> {
    constructor(partial, options?: SerializerOptions) {
        super(partial, options);
        this.results.forEach((post) => {
            post.post_metadata_id = post.post_metadata_id?.toString();
        });
    }
}

export class PostDTO extends BaseModelSerializer {
    @Expose()
    get post_id() {
        return this._id?.toString();
    }
    post_title: string;

    @Type(() => PostMetadataDTO)
    post_metadata_id: any;

    @Transform(({ value }) => value?.toString())
    topic_id: string;

    @Transform(({ value }) => value?.toString())
    next_post_id: string;

    @Transform(({ value }) => value?.toString())
    previous_post_id: string;
}

export class DetailedPostDTO extends PostDTO {
    topic_title?: string;

    created_date: number;

    @Exclude()
    content_file_id: string;

    @Exclude()
    thumbnail_file_id: string;

    content_file_url: string;
    thumbnail_file_url: string;
}
