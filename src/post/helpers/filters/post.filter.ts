import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { Tag } from "src/post/models";

export interface PostFilterOptions {
    keyword?: string;
    topic_id?: string;
}

export interface IPostFilter {
    filter(options: PostFilterOptions): any;
    filterByTag(tag: string): any;
}

@Injectable()
export class PostFilter implements IPostFilter {
    constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

    filter(options: PostFilterOptions): any[] {
        const { keyword = "", topic_id = null } = options;
        const builder = new AggregateBuilder();
        builder.match({
            ...(keyword && {
                $text: {
                    $search: keyword,
                },
            }),
            ...(topic_id && { topic_id }),
        });
        return builder.build();
    }

    filterByTag(tagId: string) {
        return [
            {
                $match: {
                    tags: tagId,
                },
            },
            {
                $lookup: {
                    from: this.tagModel.collection.name,
                    localField: "tags",
                    foreignField: "tag_id",
                    as: "tags",
                },
            },
        ];
    }
}
