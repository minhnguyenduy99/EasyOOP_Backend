import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    CreateSentenceDTO,
    CreateTestExaminationDTO,
    SearchTestDTO,
    TestExaminationDTO,
    UpdateSentenceDTO,
    UpdateTestExaminationDTO,
} from "../dtos";
import { Sentence, TestExamination, TestTopic } from "../models";
import { TEST_STATUSES, TEST_TYPES, TEST_AVAILABLE_STATUSES } from "../consts";
import { ERRORS } from "../../helpers";
import { ServiceResult } from "src/test-examination/helpers";
import { SentenceService } from "./sentence.service";
import { ServiceHelper } from "./service-helper";
import { SentenceQueryOptions, TestQueryOptions } from "./interfaces";

@Injectable()
export class TestExaminationService {
    constructor(
        @InjectModel(TestExamination.name)
        private testModel: Model<TestExamination>,
        @InjectModel(Sentence.name)
        private sentenceModel: Model<Sentence>,
        @InjectModel(TestTopic.name)
        private topicModel: Model<TestTopic>,
        private logger: Logger,
        private sentenceService: SentenceService,
        private serviceHelper: ServiceHelper,
    ) {}

    async createTest(dto: CreateTestExaminationDTO) {
        if (dto.type === TEST_TYPES.TIME_LIMITED) {
            if (!dto.limited_time) {
                return ERRORS.InvalidTimeLimited;
            }
        }
        const createTestResult = await this.createTestInstance(
            dto,
            TEST_AVAILABLE_STATUSES.AVAILABLE,
        );
        return createTestResult;
    }

    async getAllTopics() {
        const topics = await this.topicModel.find();
        return topics;
    }

    async getTestsGroupedByTopic(): Promise<any[]> {
        const builder = this.serviceHelper.groupByTopic().groupWithTopic();
        const results = await this.testModel.aggregate(builder.build()).exec();
        return results;
    }

    async updateTest(
        testId: string,
        dto: UpdateTestExaminationDTO,
    ): Promise<ServiceResult<any>> {
        const topic = await this.isTopicExist(dto.topic_id);
        if (!topic) {
            return ERRORS.TestTopicNotFound;
        }
        try {
            const test = await this.testModel.findOneAndUpdate(
                {
                    test_id: testId,
                },
                dto,
                {
                    useFindAndModify: false,
                },
            );
            if (!test) {
                return ERRORS.TestNotFound;
            }
            return {
                code: 0,
                data: test,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async updateSentence(
        testId: string,
        sentenceId: string,
        dto: UpdateSentenceDTO,
    ) {
        const test = await this.getTestById(testId);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        const result = await this.sentenceService.updateSentenceById(
            sentenceId,
            dto,
        );
        if (result.error) {
            return result;
        }
        try {
            if (dto.order || dto.order === 0) {
                await this.updateSentenceOrder(testId, sentenceId, dto.order);
            }
            return {
                code: 0,
                data: result.data,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getTestById(
        testId: string,
        queryOptions?: TestQueryOptions,
    ): Promise<TestExamination> {
        const { groupWithSentences = false, totalScore = false } =
            queryOptions ?? {};
        this.serviceHelper.filterByTestId(testId);
        if (totalScore) {
            this.serviceHelper.getWithTotalScore();
        } else {
            if (groupWithSentences) {
                this.serviceHelper.groupWithSentences();
            }
        }
        const aggregates = this.serviceHelper.build();
        const [test] = await this.testModel.aggregate(aggregates);
        return test;
    }

    async searchTest(
        dto: SearchTestDTO,
        queryOptions?: TestQueryOptions,
    ): Promise<{ count: number; results: TestExaminationDTO[] }> {
        const {
            title = null,
            creator_id = null,
            sort_by = "created_date",
            topic_id = null,
            sort_order = -1,
            verifying_status,
            type,
        } = dto;
        const { start = 0, limit } = queryOptions ?? {};
        const aggregates = this.serviceHelper
            .filter({ title, creator_id, verifying_status, type, topic_id })
            .sort({ sort_by, sort_order })
            .groupWithTopic("topic_id", false)
            .limit({ start, limit })
            .build();

        const [{ results, count }] = await this.testModel.aggregate(aggregates);

        return {
            count,
            results,
        };
    }

    async deleteTest(testId: string): Promise<ServiceResult<any>> {
        try {
            const test = await this.testModel.findOneAndUpdate(
                {
                    test_id: testId,
                    verifying_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
                },
                {
                    $set: {
                        verifying_status: TEST_AVAILABLE_STATUSES.UNAVAILABLE,
                    },
                },
                {
                    new: true,
                },
            );
            if (!test) {
                return ERRORS.TestNotFound;
            }
            // this.sentenceService.deleteSentencesByTestId(test.test_id);
            return {
                code: 0,
                data: {
                    test_id: test.test_id,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async restoreTest(
        testId: string,
    ): Promise<ServiceResult<{ test_id: string }>> {
        try {
            const test = await this.testModel.findOneAndUpdate(
                {
                    test_id: testId,
                    verifying_status: TEST_AVAILABLE_STATUSES.UNAVAILABLE,
                },
                {
                    $set: {
                        verifying_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
                    },
                },
                {
                    new: true,
                },
            );
            if (!test) {
                return ERRORS.TestNotFound;
            }
            return {
                code: 0,
                data: {
                    test_id: test.test_id,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async deleteSentenceById(sentenceId: string): Promise<ServiceResult<any>> {
        try {
            const sentence = await this.sentenceModel.findOneAndDelete({
                sentence_id: sentenceId,
            });
            if (!sentence) {
                return ERRORS.QuestionNotFound;
            }
            await this.findTestAndRemoveSentences(sentence.test_id, [
                sentenceId,
            ]);
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

    async addSentence(
        testId: string,
        sentence: CreateSentenceDTO,
    ): Promise<ServiceResult<any>> {
        const test = await this.getTestById(testId);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        const result = await this.sentenceService.createSentence(
            test,
            sentence,
        );
        if (result.error) {
            return result;
        }
        const { data: createdSentence } = result;
        try {
            await this.testModel.updateOne(
                {
                    test_id: test.test_id,
                },
                {
                    $push: {
                        list_sentence_ids: {
                            $position: sentence.order,
                            $each: [createdSentence.sentence_id],
                        },
                    },
                },
            );
            return {
                code: 0,
                data: {
                    test_id: testId,
                    sentence_id: createdSentence.sentence_id,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async addTestSentencesSequentially(
        testId: string,
        sentenceDTOs: CreateSentenceDTO[],
    ): Promise<ServiceResult<any>> {
        const test = await this.getTestById(testId);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        const createSentenceResult = await this.sentenceService.createSentenceBulk(
            test,
            sentenceDTOs,
        );
        if (createSentenceResult.error) {
            return createSentenceResult;
        }
        const {
            data: { sentence_ids },
        } = createSentenceResult;
        try {
            await this.testModel.updateOne(
                {
                    test_id: test.test_id,
                },
                {
                    $push: {
                        list_sentence_ids: sentence_ids,
                    },
                },
            );
            return {
                code: 0,
                data: {
                    test_id: testId,
                    list_sentence_ids: sentence_ids,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getTestWithSentences(
        testId: string,
        queryOptions: SentenceQueryOptions,
    ): Promise<
        ServiceResult<{
            total_count: number;
            test: TestExamination & { total_count: number; sentences: any[] };
        }>
    > {
        const { start = 0, limit, verifying_status } = queryOptions;
        const aggregates = this.serviceHelper
            .filterByTestId(testId)
            .filter({ verifying_status })
            .sentenceIdsInRange({ start, limit })
            .groupWithSentences()
            .build();
        const [test] = await this.testModel.aggregate(aggregates);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        return {
            code: 0,
            data: {
                total_count: test.total_count,
                test,
            },
        };
    }

    async getSentenceByIndex(
        testId: string,
        index: number,
    ): Promise<ServiceResult<Sentence>> {
        const aggregates = this.serviceHelper
            .filterByTestId(testId)
            .sentenceIdsInRange({ start: index, limit: 1 })
            .groupWithSentences()
            .build();
        const [test] = await this.testModel.aggregate(aggregates);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        return {
            code: 0,
            data: test.sentences?.[0],
        };
    }

    async removeSentences(
        testId: string,
        sentenceIds: string[],
    ): Promise<ServiceResult<any>> {
        try {
            const test = await this.findTestAndRemoveSentences(
                testId,
                sentenceIds,
            );
            if (!test) {
                return ERRORS.TestNotFound;
            }

            await this.sentenceService.deleteSentenceBulk(testId, sentenceIds);
            return {
                code: 0,
                data: {
                    test_id: testId,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getTotalScore(
        testId: string,
    ): Promise<ServiceResult<{ total_score: number; test_id: string }>> {
        const test = await this.getTestById(testId);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        const aggregates = this.serviceHelper
            .totalScore(test.test_id, test.default_score_per_sentence)
            .build();

        const [result] = await this.sentenceModel.aggregate(aggregates);
        return {
            code: 0,
            data: result,
        };
    }

    protected async updateSentenceOrder(
        testId: string,
        sentenceId: string,
        newOrder: number,
    ) {
        await this.findTestAndRemoveSentences(testId, [sentenceId]);
        await this.testModel.updateOne(
            {
                test_id: testId,
            },
            {
                $push: {
                    list_sentence_ids: {
                        $position: newOrder,
                        $each: [sentenceId],
                    },
                },
            },
        );
    }

    protected async findTestAndRemoveSentences(
        testId: string,
        sentenceIds: string[],
    ) {
        return this.testModel.findOneAndUpdate(
            {
                test_id: testId,
            },
            {
                $pull: { list_sentence_ids: { $in: sentenceIds } },
            },
        );
    }

    protected async createTestInstance(
        dto: CreateTestExaminationDTO,
        status: number,
    ): Promise<ServiceResult<TestExamination>> {
        const input = {
            ...dto,
            verifying_status: status,
        };
        const topic = await this.isTopicExist(dto.topic_id);
        if (!topic) {
            return ERRORS.TestTopicNotFound;
        }
        try {
            const result = await this.testModel.create(input);
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    protected async isTopicExist(topicId: string) {
        const topic = await this.topicModel.findOne({
            topic_id: topicId,
        });
        return !!topic;
    }
}
