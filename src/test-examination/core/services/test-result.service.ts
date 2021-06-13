import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SentenceService } from ".";
import {
    CreateSentenceResultDTO,
    CreateTestResultDTO,
    DetailedTestResultDTO,
    SentenceResultDTO,
} from "../dtos";
import { TestExamination, Sentence, TestResult } from "../models";
import { TestExaminationService } from "./test-examination.service";
import { ERRORS, ServiceResult } from "../../helpers";
import {
    DetailedTestResultQueryOptions,
    TestResultQueryOptions,
} from "./interfaces";
import { TestResultServiceHelper } from "./test-result-service-helper";
import { GenerateDigitID } from "src/lib/helpers";

@Injectable()
export class TestResultService {
    constructor(
        @InjectModel(TestExamination.name)
        private testModel: Model<TestExamination>,
        @InjectModel(Sentence.name)
        private sentenceModel: Model<Sentence>,
        @InjectModel(TestResult.name)
        private testResultModel: Model<TestResult>,
        private logger: Logger,
        private sentenceService: SentenceService,
        private serviceHelper: TestResultServiceHelper,
        private testService: TestExaminationService,
    ) {}

    async createTestResult(
        dto: CreateTestResultDTO,
        save?: boolean,
    ): Promise<ServiceResult<TestResult>> {
        const test = await this.testService.getTestById(dto.test_id, {
            groupWithSentences: true,
        });
        if (!this.isTestable(test)) {
            return ERRORS.TestNotFound;
        }
        const { results, ...testResultInfo } = dto;
        const result = await this.getObtainedScore(results, test);
        let input = {
            results: results.map((sentence, index) => ({
                ...sentence,
                answer: test.sentences[index].answer,
            })),
            ...testResultInfo,
            ...result,
        };
        try {
            if (!save) {
                input.total_sentence_count = test.list_sentence_ids.length;
                return {
                    code: 0,
                    data: input,
                };
            }
            const testResult = await this.createTestInstance(
                dto.user_id,
                dto.test_id,
                input,
            );
            testResult.total_sentence_count = test.list_sentence_ids.length;
            return {
                code: 0,
                data: testResult,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getTestResultById(
        resultId: string,
        options?: DetailedTestResultQueryOptions,
    ) {
        const aggregates = this.serviceHelper
            .filterByResultId(resultId)
            .groupWithTest()
            .build();

        const result = await this.testResultModel.aggregate(aggregates);
        return result?.[0];
    }

    async getTestResultsByUser(
        userId: string,
        queryoptions?: TestResultQueryOptions,
    ) {
        const { start, limit, sort_by, sort_order } = queryoptions;
        const aggregates = this.serviceHelper
            .filter({ user_id: userId })
            .groupWithTest()
            .sort(sort_by, sort_order)
            .limit(start, limit)
            .build();

        const [results] = await this.testResultModel.aggregate(aggregates);
        return results;
    }

    async getResultOfSentence(
        sentenceId: string,
        sentenceResult: CreateSentenceResultDTO,
    ) {
        const sentence = await this.sentenceService.getSentenceById(sentenceId);
        if (!sentence) {
            return null;
        }
        const { user_answer, sentence_id } = sentenceResult;
        const { answer, score } = sentence;
        return {
            sentence_id,
            user_answer,
            answer,
            obtained_score: answer === user_answer ? score : 0,
        } as SentenceResultDTO;
    }

    async getTestResult(userId: string, testId: string) {
        return this.testResultModel.findOne({
            user_id: userId,
            test_id: testId,
        });
    }

    async getDetailedTestResults(
        resultId: string,
        options?: DetailedTestResultQueryOptions,
    ): Promise<DetailedTestResultDTO> {
        const { start, limit } = options;
        const aggregates = this.serviceHelper
            .filterByResultId(resultId)
            .resultsInRange(start, limit, "detailed_results")
            .groupWithSentences("detailed_results")
            .build();

        const [result] = await this.testResultModel.aggregate(aggregates);
        return result;
    }

    protected async getObtainedScore(
        results: CreateSentenceResultDTO[],
        test?: TestExamination,
    ) {
        const sentenceObj = results.reduce(
            (pre, cur) => ({ ...pre, [cur.sentence_id]: cur.user_answer }),
            {},
        );
        const scores = test.sentences
            .map(({ sentence_id, answer, score }) => ({
                sentence_id,
                score: score === 0 ? test.default_score_per_sentence : score,
                correct: answer === sentenceObj[sentence_id],
            }))
            .reduce(accumulateScore, {
                total_score: 0,
                obtained_score: 0,
                correct_answer_count: 0,
            });
        return scores;

        function accumulateScore(pre, cur) {
            return {
                total_score: pre.total_score + cur.score,
                obtained_score:
                    pre.obtained_score + (cur.correct ? cur.score : 0),
                correct_answer_count: cur.correct
                    ? ++pre.correct_answer_count
                    : pre.correct_answer_count,
            };
        }
    }

    protected async createTestInstance(
        userId: string,
        testId: string,
        dto: any,
    ) {
        dto.result_id = GenerateDigitID(10);
        dto.created_date = Date.now();
        console.log(dto);
        const result = await this.testResultModel.findOneAndUpdate(
            {
                user_id: userId,
                test_id: testId,
            },
            dto,
            {
                useFindAndModify: false,
                upsert: true,
                new: true,
            },
        );
        return result;
    }

    protected isTestable(test: TestExamination) {
        return (
            test && test?.test_id
            // test.verifying_status === TEST_STATUSES.VERIFIED
        );
    }
}
