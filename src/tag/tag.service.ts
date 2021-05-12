import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { TagSearchDTO } from "./tag.dto";
import { Tag } from "./tag.model";
import ServiceErrors from "./errors";

export interface ServiceResult<T> {
    code: number;
    error?: string;
    data?: T;
}
export interface ITagService {
    searchForTags(searchOptions?: TagSearchDTO): Promise<any>;
    useTags(tagIds: string[]): Promise<ServiceResult<any>>;
    getTagById(tagId: string): Promise<Tag>;
}

@Injectable()
export class TagService implements ITagService {
    constructor(
        @InjectModel(Tag.name) private readonly tagModel: Model<Tag>,
        private logger: Logger,
    ) {}

    async getTagById(tagId: string): Promise<Tag> {
        const tag = await this.tagModel.findOne({ tag_id: tagId });
        return tag;
    }

    async useTags(tagIds: string[]): Promise<any> {
        try {
            const result = await this.tagModel.updateMany(
                {
                    tag_id: {
                        $in: tagIds,
                    },
                },
                {
                    used: true,
                },
                {
                    useFindAndModify: false,
                },
            );
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger.error(err);
            return ServiceErrors.ServiceError;
        }
    }

    async unuseTags(tagIds: string[]): Promise<any> {
        try {
            const result = await this.tagModel.updateMany(
                {
                    tag_id: {
                        $in: tagIds,
                    },
                },
                {
                    used: false,
                },
                {
                    useFindAndModify: false,
                },
            );
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger.error(err);
            return ServiceErrors.ServiceError;
        }
    }

    async searchForTags(searchOptions?: TagSearchDTO): Promise<any> {
        const { value, type, used, start, limit } = searchOptions;
        const result = await this.tagModel.aggregate(
            new AggregateBuilder()
                .match({
                    ...(value && {
                        $or: [{ $text: { $search: value } }, { tag_id: value }],
                    }),
                    tag_type: type,
                    ...(used !== null && { used }),
                })
                .limit({
                    start,
                    limit,
                })
                .log(null)
                .build(),
        );
        const [{ count, results }] = result;
        return {
            count,
            results,
        };
    }
}
