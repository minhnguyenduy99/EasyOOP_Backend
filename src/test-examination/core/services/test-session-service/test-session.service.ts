import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ERRORS, ServiceResult } from "src/test-examination/helpers";
import { SentenceResultDTO } from "../../dtos";
import { TestExamination, TestResult } from "../../models";
import { TestExaminationService } from "../test-examination.service";
import { TestResultService } from "../test-result.service";
import { CreateSessionOptions, TestSession } from "./interfaces";

export interface ITestSession {
    createTestSession(option: CreateSessionOptions): Promise<any>;
    updateSentenceResult(
        userId: string,
        testId: string,
        sentenceId: string,
        answer: number,
    ): Promise<any>;
    finishTest(userId: string, testId: string): Promise<any>;
    deleteSession(userId: string, testId: string): Promise<any>;
}

@Injectable()
export class TestSessionService implements ITestSession {
    protected readonly DEFAULT_SENTENCE_PER_CACHE = 5;
    protected readonly DEFAULT_EXPIRED_TIME = 1000;
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private testService: TestExaminationService,
        private testResultService: TestResultService,
        private logger: Logger,
    ) {}

    async createTestSession(
        option: CreateSessionOptions,
    ): Promise<ServiceResult<any>> {
        const { userId, testId } = option;
        if (!userId) {
            return ERRORS.MissingUserID;
        }
        const test = await this.testService.getTestById(testId);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        try {
            await this.createSession(userId, test);
            return {
                code: 0,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async updateSentenceResult(
        userId: string,
        testId: string,
        sentenceId: string,
        answer: number,
    ) {
        const sessionId = this.createResultSessionId(userId, testId);
        const testSession = (await this.cacheManager.get(
            sessionId,
        )) as TestSession;

        if (!testSession) {
            return ERRORS.TestSessionNotEstablished;
        }
        const sentence = testSession.userAnswers[sentenceId];
        if (!sentence) {
            return ERRORS.QuestionNotFound;
        }
        if (sentence === -1) {
            testSession.countAnswer++;
        }
        testSession.userAnswers[sentenceId] = answer;
        await this.updateSession(sessionId, testSession);
        return {
            code: 0,
        };
    }

    async finishTest(userId: string, testId: string) {
        const sessionId = this.createResultSessionId(userId, testId);
        const testSession = (await this.cacheManager.get(
            sessionId,
        )) as TestSession;
        if (!testSession) {
            return ERRORS.TestSessionNotEstablished;
        }
        const result = await this.createTestResult(sessionId, testSession);
        if (result.error) {
            return result;
        }
        await this.cacheManager.del(sessionId);
        return result;
    }

    async deleteSession(userId: string, testId: string) {
        const sessionId = this.createResultSessionId(userId, testId);
        await this.cacheManager.del(sessionId);
    }

    protected async createTestResult(
        sessionId: string,
        testSession: TestSession,
    ): Promise<ServiceResult<TestResult>> {
        const { testId, userId } = this.parseSessionId(sessionId);
        const { userAnswers } = testSession;
        const results = Object.keys(userAnswers).map(
            (sentenceId) =>
                ({
                    sentence_id: sentenceId,
                    user_answer: userAnswers[sentenceId],
                } as SentenceResultDTO),
        );
        try {
            const result = await this.testResultService.createTestResult({
                test_id: testId,
                user_id: userId,
                results,
            });
            return result;
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    protected async getPartialTest(
        testId: string,
        page: number,
        count: number,
    ) {
        const result = await this.testService.getTestWithSentences(testId, {
            start: (page - 1) * count,
            limit: count,
        });
        return result;
    }

    protected async createSession(userId: string, test: TestExamination) {
        const resultSessionId = this.createResultSessionId(
            userId,
            test.test_id,
        );
        const expiredCacheTimeInSeconds =
            10 +
            (test.limited_time === 0
                ? this.DEFAULT_EXPIRED_TIME
                : test.limited_time);
        const sessionValue = {
            countAnswer: 0,
            expired: Date.now() + expiredCacheTimeInSeconds * 1000,
            userAnswers: test.list_sentence_ids.reduce(
                (pre, cur) => ({ ...pre, [cur]: -1 }),
                {},
            ),
        } as TestSession;
        await Promise.all([
            this.cacheManager.set(resultSessionId, sessionValue, {
                ttl: expiredCacheTimeInSeconds,
            }),
        ]);
    }

    protected createResultSessionId(userId: string, testId: string) {
        return `${userId}_${testId}`;
    }

    protected async updateSession(sessionId: string, session: TestSession) {
        const expiresTime = session.expired - Date.now();
        await this.cacheManager.set(sessionId, session, {
            ttl: expiresTime,
        });
    }

    protected parseSessionId(sessionId: string) {
        const [userId, testId] = sessionId.split("_");
        return {
            userId,
            testId,
        };
    }
}
