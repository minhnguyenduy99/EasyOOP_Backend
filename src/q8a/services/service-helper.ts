import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { Tag, TagType } from "src/tag";

@Injectable()
export class Q8AServiceHelper {
    protected builder: AggregateBuilder;

    constructor(@InjectModel(Tag.name) private tagModel: Model<Tag>) {
        this.builder = new AggregateBuilder();
    }

    filter(search: any) {
        const { value, hasTag } = search;
        this.builder.match({
            ...(value && {
                $text: {
                    $search: value,
                },
            }),
            ...(hasTag === true && { tag_id: { $ne: null } }),
            ...(hasTag === false && {
                $or: [{ tag_id: null }, { tag_id: { $exists: false } }],
            }),
        });
        return this;
    }

    filterByTagId(tagId: string) {
        this.builder.match({
            tag_id: tagId,
        });
        return this;
    }

    limit(limiter: any) {
        this.builder.limit(limiter);
        return this;
    }

    groupWithTag() {
        this.builder.lookup({
            from: this.tagModel,
            localField: "tag_id",
            foreignField: "tag_id",
            removeFields: ["__v"],
            pipeline: [
                {
                    $match: {
                        tag_type: TagType.question,
                    },
                },
            ],
            mergeObject: true,
            as: "tag",
        });
        return this;
    }

    sortByTag() {
        this.builder.sort({ tag_id: -1 });
        return this;
    }

    build() {
        return this.builder.build();
    }
}
