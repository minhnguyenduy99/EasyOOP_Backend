import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { CreateTagsDTO, TagSearchDTO, UpdateTagDTO } from "./tag.dto";
import { Tag } from "./tag.model";
import ServiceErrors from "./errors";
import { MongoWriteBulkError } from "src/lib/database/mongo/helpers/mongo-errors";

export interface ServiceResult<T> {
    code: number;
    error?: string;
    data?: T;
}
export interface ITagService {
    searchForTags(searchOptions?: TagSearchDTO): Promise<any>;
    createTags(dto: CreateTagsDTO): Promise<any>;
    useTags(
        tagIds: string[],
    ): Promise<
        ServiceResult<{ count: number; failedCount?: number; errors?: any[] }>
    >;
    getTagById(tagId: string): Promise<Tag>;
    getAllTagsByType(type: string): Promise<Tag[]>;
    updateTag(tagId: string, dto: UpdateTagDTO): Promise<ServiceResult<Tag>>;
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

    async createTags(
        dto: CreateTagsDTO,
    ): Promise<
        ServiceResult<{ count: number; failedCount?: number; errors?: any[] }>
    > {
        const tagInputs = dto.tags.map((tag) => ({
            ...tag,
            tag_type: dto.type,
        }));
        try {
            const results = await this.tagModel.insertMany(tagInputs, {
                ordered: false,
            });
            return {
                code: 0,
                data: {
                    count: results.length,
                },
            };
        } catch (err) {
            const {
                writeErrors,
                errmsg,
                result: { nInserted },
            } = err as MongoWriteBulkError<any>;
            this.logger.error(ServiceErrors.DuplicateTagID.error);
            this.logger.error(errmsg);
            return {
                code: 0,
                data: {
                    count: nInserted,
                    failedCount: writeErrors.length,
                    errors: writeErrors.map((writeError) => {
                        const {
                            index,
                            code,
                            op: { tag_id },
                        } = writeError.err;
                        return {
                            index,
                            code,
                            tag_id,
                        };
                    }),
                },
            };
        }
    }

    async updateTag(
        tagId: string,
        dto: UpdateTagDTO,
    ): Promise<ServiceResult<Tag>> {
        const { tag_type, tag_value } = dto;
        const currentTag = await this.tagModel.findOne({
            tag_type,
            tag_id: tagId,
        });
        if (!currentTag) {
            return ServiceErrors.TagNotFound;
        }
        try {
            currentTag.tag_value = tag_value;
            await currentTag.save();
            return {
                code: 0,
                data: currentTag,
            };
        } catch (err) {
            this.logger.error(err);
            return ServiceErrors.ServiceError;
        }
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
        const {
            value = null,
            type = null,
            used = null,
            start,
            limit,
        } = searchOptions;
        const searchRegex = RegExp(`${value}`, "gi");
        const result = await this.tagModel.aggregate(
            new AggregateBuilder()
                .match({
                    ...(value && {
                        $or: [
                            { $text: { $search: value } },
                            { tag_id: { $regex: searchRegex } },
                        ],
                    }),
                    ...(type && { tag_type: type }),
                    ...(used !== null && { used }),
                })
                .limit({
                    start,
                    limit,
                })
                .build(),
        );
        const [{ count, results }] = result;
        return {
            count,
            results,
        };
    }

    async getAllTagsByType(type: string) {
        const result = await this.tagModel.find({
            tag_type: type,
        });
        return result;
    }
}
