import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { TagType } from "./consts";
import { Tag } from "./tag.model";

export interface ITagService {
    searchForTags(value: string, type: TagType): Promise<Tag[]>;
}

@Injectable()
export class TagService implements ITagService {
    constructor(@InjectModel(Tag.name) private readonly tagModel: Model<Tag>) {}

    async searchForTags(value: string, type: TagType): Promise<Tag[]> {
        const results = await this.tagModel.aggregate(
            new AggregateBuilder()
                .match({
                    tag_type: type,
                })
                .match({
                    tag_value: {
                        $text: { $search: value },
                    },
                })
                .log(null)
                .build(),
        );
        return results;
    }
}
