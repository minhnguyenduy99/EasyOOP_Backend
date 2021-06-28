import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { remove as removeAccents } from "remove-accents";
import { AggregateBuilder } from "src/lib/database/mongo";
import { Tag, TagService, TagType } from "src/tag";
import {
    CommitActionResult,
    CreateQ8ADTO,
    UpdateQ8ADTO,
    Q8ADTO,
    SearchQ8ADTO,
} from "../dtos";
import { Q8AModel } from "../models";
import ServiceErrors from "../errors";
import { Q8AServiceHelper } from "./service-helper";

export interface IQ8AService {
    createQ8A(input: CreateQ8ADTO): Promise<CommitActionResult<Q8AModel>>;
    updateQ8A(
        qaId: string,
        input: UpdateQ8ADTO,
    ): Promise<CommitActionResult<Q8AModel>>;
    getQ8AById(id: string): Promise<Q8AModel>;
    getListQ8As(dto: SearchQ8ADTO): Promise<any>;
    getQ8AByTag(tagId: string): Promise<Q8ADTO>;
    getUnusedQuestionTags(search?: string): Promise<any>;
}

@Injectable()
export class Q8AService implements IQ8AService {
    constructor(
        @InjectModel(Q8AModel.name)
        private q8aModel: Model<Q8AModel>,
        @InjectModel(Tag.name)
        private tagModel: Model<Tag>,
        private tagService: TagService,
        private logger: Logger,
        private serviceHelper: Q8AServiceHelper,
    ) {}

    getUnusedQuestionTags(search?: string): Promise<any> {
        return this.tagService.searchForTags({
            value: search,
            type: TagType.question,
            start: 0,
            limit: 100,
            used: false,
        });
    }

    async createQ8A(input: CreateQ8ADTO): Promise<CommitActionResult<any>> {
        const { tag_id } = input;
        if (tag_id) {
            const tag = await this.tagService.getTagById(
                tag_id,
                TagType.question,
            );
            if (!tag) {
                return ServiceErrors.InvalidTag;
            }
            if (tag.used) {
                return ServiceErrors.UsedTag;
            }
        }
        try {
            let inputDoc = {
                ...input,
                unanccented_question: removeAccents(input.question),
                tag_id: tag_id ?? null,
            };
            const [result, useTagResult] = await Promise.all([
                this.q8aModel.create(inputDoc),
                tag_id
                    ? this.tagService.useTags([tag_id])
                    : Promise.resolve(true),
            ]);
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger.error(err);
            return ServiceErrors.ServiceError;
        }
    }

    async updateQ8A(
        qaId: string,
        input: UpdateQ8ADTO,
    ): Promise<CommitActionResult<Q8AModel>> {
        const { tag_id } = input;
        const question = await this.getQ8AById(qaId);
        if (!question) {
            return ServiceErrors.QuestionNotFound;
        }
        if (tag_id) {
            const result = await this.validateTag(tag_id, question.tag_id);
            if (result.error) {
                return result as CommitActionResult<any>;
            }
        }
        const oldTagId = question.tag_id;
        try {
            const inputDoc = {
                ...input,
                unaccented_question: removeAccents(input?.question ?? ""),
            };
            await question.updateOne(inputDoc);
            if (oldTagId !== tag_id) {
                await Promise.all([
                    this.tagService.useTags([tag_id]),
                    this.tagService.unuseTags([oldTagId]),
                ]);
            }
            return {
                code: 0,
                data: question,
            };
        } catch (err) {
            this.logger.error(err);
            return ServiceErrors.ServiceError;
        }
    }

    async getQ8AByTag(tagId: string) {
        const aggregates = this.serviceHelper
            .filterByTagId(tagId)
            .groupWithTag()
            .build();
        const queriedResult = await this.q8aModel.aggregate(aggregates);
        const [result] = queriedResult;
        if (!result) {
            return null;
        }
        return result;
    }

    async getQ8AById(id: string): Promise<Q8AModel> {
        const q8a = await this.q8aModel.findOne({
            qa_id: id,
        });
        return q8a;
    }

    async getListQ8As(dto: SearchQ8ADTO) {
        const { value, hasTag, start, limit } = dto;
        const builder = this.serviceHelper
            .filter({ value, hasTag })
            .sortByTag()
            .groupWithTag()
            .limit({ start, limit });

        const result = await this.q8aModel.aggregate(builder.build()).exec();

        const [{ count, results }] = result;
        return {
            count,
            results,
        };
    }

    protected async validateTag(tagId: string, currentTagId: string = null) {
        let tag = await this.tagService.getTagById(tagId, TagType.question);
        if (!tag) {
            return ServiceErrors.InvalidTag;
        }
        if (tag.used && currentTagId !== tagId) {
            return ServiceErrors.UsedTag;
        }
        return {
            error: null,
            data: tag,
        };
    }
}
