import { Exclude, Transform, Type } from "class-transformer";
import { BaseModelSerializer, BasePaginationSerializer } from "src/lib/helpers";
import { TagDTO } from "src/tag";
import { TopicDTO } from "../topic.dto";
import { PostMetadataDTO } from "./post-metadata.dto";

export class PaginatedPostDTO extends BasePaginationSerializer<PostDTO> {
    @Type(() => PostDTO)
    results: PostDTO[];

    constructor(partial) {
        super(partial, {
            serializeResults: false,
        });
    }
}

export class PostDTO extends BaseModelSerializer {
    post_id: string;
    post_title: string;

    @Type(({ object, property }) => {
        if (object[property] instanceof PostMetadataDTO) {
            return PostMetadataDTO;
        }
        return String;
    })
    post_metadata_id: any;

    @Transform(({ value }) => value?.toString())
    topic_id: string;

    @Transform(({ value }) => value?.toString())
    next_post_id: string;

    @Transform(({ value }) => value?.toString())
    previous_post_id: string;

    @Type(() => TagDTO)
    tags: TagDTO[];

    created_date: number;
}

export class PostWithTagDTO extends BaseModelSerializer {
    tags: string[];

    @Type(() => PostDTO)
    results: PostDTO[];
}

export class PostWithTopicDTO extends TopicDTO {
    @Type(() => PostDTO)
    list_posts: PostDTO[];
}
