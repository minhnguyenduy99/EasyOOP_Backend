import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateSentenceDTO, UpdateSentenceDTO } from "../dtos";
import { Sentence, TestExamination } from "../models";
import { AggregateBuilder } from "src/lib/database/mongo";
import { SentenceQueryOptions, TestFilter } from "./interfaces";
import { ERRORS, ServiceResult } from "src/test-examination/helpers";
import { SentenceServiceHelper } from "./helpers";

@Injectable()
export class SentenceService {
    constructor(
        @InjectModel(TestExamination.name)
        private testModel: Model<TestExamination>,
        @InjectModel(Sentence.name)
        private sentenceModel: Model<Sentence>,
        private sentenceServiceHelper: SentenceServiceHelper,
        private logger: Logger,
    ) {}

    /**
     * @deprecated
     * @param testOrId
     * @param sentence
     * @returns
     */
    async createSentence(
        testOrId: string | TestExamination,
        sentence: CreateSentenceDTO,
    ): Promise<ServiceResult<Sentence>> {
        const test = await this.getTestInstance(testOrId);
        sentence.test_id = test.test_id;
        sentence.score === 0 &&
            (sentence.score = test.default_score_per_sentence);
        try {
            const createdSentence = await this.sentenceModel.create(sentence);
            return {
                code: 0,
                data: createdSentence,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async createSentenceBulk(
        testOrId: string | TestExamination,
        dtos: CreateSentenceDTO[],
    ): Promise<ServiceResult<{ test_id: string; sentence_ids: string[] }>> {
        const test = await this.getTestInstance(testOrId);
        const currentCount = test.sentence_count;
        const inputs = dtos.map((dto, index) => {
            dto.test_id = test.test_id;
            dto.score === 0 && (dto.score = test.default_score_per_sentence);
            dto.order = currentCount + index + 1;
            return dto;
        }) as any[];

        try {
            const sentences = await this.sentenceModel.create(inputs);
            const sentenceIds = sentences.map(
                (sentence) => sentence.sentence_id,
            );
            return {
                code: 0,
                data: {
                    test_id: test.test_id,
                    sentence_ids: sentenceIds,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getSentenceById(sentenceId: string) {
        return this.sentenceModel.findOne({
            sentence_id: sentenceId,
        });
    }

    async getSentenceByOrder(testId: string, order: number) {
        return this.sentenceModel.findOne({
            test_id: testId,
            order,
        });
    }

    async getSentenceIds(testId: string) {
        const sentences = await this.sentenceModel.find(
            {
                test_id: testId,
            },
            {
                sentence_id: 1,
            },
        );
        return sentences.map((sentence) => sentence.sentence_id);
    }

    async getAllSentences(testId: string) {
        const result = await this.getSentences(testId, { start: 0 });
        return result.results;
    }

    async getSentences(
        testId: string,
        queryOptions?: SentenceQueryOptions,
    ): Promise<{ count: number; results: Sentence[] }> {
        const { start = 0, limit = 100 } = queryOptions ?? {};
        const queryBuild = this.sentenceServiceHelper
            .filterByTestId({ test_id: testId })
            .limit(start, limit)
            .build();

        const [{ count, results }] = await this.sentenceModel
            .aggregate(queryBuild)
            .exec();

        return {
            count,
            results,
        };
    }

    async searchSentences(testId: string, sentenceIds: string[]) {
        const sentencesObj = sentenceIds.reduce(
            (pre, cur, index) => ({ ...pre, [cur]: index }),
            {},
        );
        const builder = new AggregateBuilder();
        let results = builder
            .match({
                test_id: testId,
                sentence_id: {
                    $in: sentenceIds,
                },
            })
            .build();
        results = results.sort(
            (senA, senB) =>
                sentencesObj[senA.sentence_id] - sentencesObj[senB.sentence_id],
        );
        return results as Sentence[];
    }

    async updateSentenceById(
        sentenceId: string,
        dto: UpdateSentenceDTO,
    ): Promise<ServiceResult<Sentence>> {
        try {
            const sentence = await this.sentenceModel.findOneAndUpdate(
                {
                    sentence_id: sentenceId,
                },
                dto,
                {
                    useFindAndModify: false,
                },
            );
            if (!sentence) {
                return ERRORS.QuestionNotFound;
            }
            return {
                code: 0,
                data: sentence,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    /**
     * @deprecated
     * @param sentenceId
     * @returns
     */
    async deleteSentenceById(sentenceId: string): Promise<ServiceResult<any>> {
        try {
            const sentence = await this.sentenceModel.findOneAndDelete(
                {
                    sentence_id: sentenceId,
                },
                {
                    useFindAndModify: false,
                    projection: {
                        sentence_id: 1,
                    },
                },
            );
            if (!sentence) {
                return ERRORS.QuestionNotFound;
            }
            return {
                code: 0,
                data: {
                    sentence_id: sentence.sentence_id,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    /**
     * @deprecated
     */
    async deleteSentenceBulk(
        testId: string,
        sentenceIds: string[],
    ): Promise<ServiceResult<any>> {
        try {
            const result = await this.sentenceModel.deleteMany(
                {
                    test_id: testId,
                    sentence_id: { $in: sentenceIds },
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
            return ERRORS.ServiceError;
        }
    }

    async deleteSentencesByTestId(testId: string) {
        try {
            const result = await this.sentenceModel.deleteMany({
                test_id: testId,
            });
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    protected async getTestInstance(
        testOrId: string | TestExamination,
    ): Promise<TestExamination> {
        let test = testOrId;
        if (typeof testOrId === "string") {
            test = await this.testModel.findOne({
                test_id: testOrId,
            });
        }
        return test as TestExamination;
    }
}
