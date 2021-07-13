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
import { ERRORS, ServiceResult } from "src/test-examination/helpers";
import { SentenceQueryOptions, TestQueryOptions } from "./interfaces";
import { SentenceService } from "./sentence.service";
import { SentenceServiceHelper, TestServiceHelper } from "./helpers";

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
        private serviceHelper: TestServiceHelper,
        private sentenceServiceHelper: SentenceServiceHelper,
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
        const topics = await this.topicModel.find().sort({
            topic_order: 1,
        });
        return topics;
    }

    async getTestsGroupedByTopic(): Promise<any[]> {
        const builder = this.serviceHelper
            .filter({ available_status: TEST_AVAILABLE_STATUSES.AVAILABLE })
            .groupByTopic()
            .groupWithTopic();
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
        const test = await this.getTestDetailById(testId);
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
        return {
            code: 0,
            data: result.data,
        };
    }

    async getTestDetailById(testId: string): Promise<TestExamination> {
        const aggregates = this.sentenceServiceHelper
            .filterByTestId({ test_id: testId })
            .groupByTest()
            .groupWithTopic()
            .build();

        const [test] = await this.sentenceModel.aggregate(aggregates);
        return test;
    }

    async findTestById(testId: string) {
        return this.testModel.findOne({
            test_id: testId,
        });
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
            available_status,
            type,
        } = dto;
        const { start = 0, limit } = queryOptions ?? {};
        const aggregates = this.serviceHelper
            .filter({ title, creator_id, available_status, type, topic_id })
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
                    available_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
                },
                {
                    $set: {
                        available_status: TEST_AVAILABLE_STATUSES.UNAVAILABLE,
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

    async restoreTest(
        testId: string,
    ): Promise<ServiceResult<{ test_id: string }>> {
        try {
            const test = await this.testModel.findOneAndUpdate(
                {
                    test_id: testId,
                    available_status: TEST_AVAILABLE_STATUSES.UNAVAILABLE,
                },
                {
                    $set: {
                        available_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
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

    async deleteTestPermanently(testId: string) {
        try {
            const test = await this.testModel.findOneAndDelete({
                test_id: testId,
            });
            if (!test) {
                return ERRORS.TestNotFound;
            }
            this.sentenceService.deleteSentencesByTestId(testId);
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

    /**
     * @deprecated
     * @param testId
     * @param sentence
     * @returns
     */
    async addSentence(
        testId: string,
        sentence: CreateSentenceDTO,
    ): Promise<ServiceResult<any>> {
        const test = await this.getTestDetailById(testId);
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
        let test = await this.findTestById(testId);
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
        try {
            test = await this.testModel.findOneAndUpdate(
                {
                    test_id: test.test_id,
                },
                {
                    $inc: {
                        sentence_count: sentenceDTOs.length,
                    },
                },
            );
            return {
                code: 0,
                data: {
                    test_id: testId,
                    list_sentence_ids: createSentenceResult.data.sentence_ids,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getTotalScore(
        testId: string,
    ): Promise<{
        total_score: number;
        test_id: string;
        sentence_count: number;
    }> {
        const build = await this.sentenceServiceHelper
            .filterByTestId({ test_id: testId })
            .groupByTest()
            .build();

        const [result] = await this.sentenceModel.aggregate(build);
        if (!result) {
            return null;
        }
        const { test_id, total_score, sentence_count } = result;
        return {
            test_id,
            total_score,
            sentence_count,
        };
    }

    protected async createTestInstance(
        dto: CreateTestExaminationDTO,
        status: number,
    ): Promise<ServiceResult<TestExamination>> {
        const input = {
            ...dto,
            available_status: status,
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
