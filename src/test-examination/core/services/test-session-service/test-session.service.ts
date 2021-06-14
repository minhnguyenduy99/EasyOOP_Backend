import { CACHE_MANAGER, Inject, Injectable, Logger } from "@nestjs/common";
import { Cache } from "cache-manager";
import { ERRORS, ServiceResult } from "src/test-examination/helpers";
import { CONFIG_KEYS } from "../../config";
import { TEST_AVAILABLE_STATUSES } from "../../consts";
import { SentenceDTO, SentenceResultDTO } from "../../dtos";
import { TestExamnimationCoreConfig } from "../../interfaces";
import { Sentence, TestExamination, TestResult } from "../../models";
import { SentenceQueryOptions } from "../interfaces";
import { SentenceService } from "../sentence.service";
import { TestExaminationService } from "../test-examination.service";
import { TestResultService } from "../test-result.service";
import { CreateSessionOptions, TestSession } from "./interfaces";
import { SessionTimer } from "./timer";

export interface ITestSession {
    createTestSession(option: CreateSessionOptions): Promise<any>;
    updateSentenceResult(
        sessionId: string,
        sentenceId: string,
        answer: number,
    ): Promise<any>;
    finishTest(sessionId: string, userId: string): Promise<any>;
    deleteSession(sessionId: string): Promise<any>;
}

@Injectable()
export class TestSessionService implements ITestSession {
    protected readonly DEFAULT_SENTENCE_PER_CACHE = 5;
    protected readonly DEFAULT_EXPIRED_TIME = 86400;
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(CONFIG_KEYS.CONFIG) private config: TestExamnimationCoreConfig,
        private testService: TestExaminationService,
        private testResultService: TestResultService,
        private sentenceService: SentenceService,
        private logger: Logger,
    ) {}

    async createTestSession(
        option: CreateSessionOptions,
    ): Promise<ServiceResult<TestSession>> {
        const { testId } = option;
        const test = await this.testService.getTestById(testId);
        if (!test) {
            return ERRORS.TestNotFound;
        }
        try {
            const session = await this.createSession(test);
            return {
                code: 0,
                data: session,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    async getTestSessionById(sessionId: string): Promise<TestSession> {
        return this.cacheManager.get(sessionId);
    }

    async getTestResultBySessionId(
        sessionId: string,
    ): Promise<ServiceResult<TestResult>> {
        const session = (await this.cacheManager.get(sessionId)) as TestSession;
        if (!session) {
            return ERRORS.TestSessionNotEstablished;
        }
        const answers = session.userAnswers.map((answer) => ({
            sentence_id: answer.sentenceId,
            user_answer: answer.userAnswer,
        }));
        const result = await this.testResultService.createTestResult(
            {
                test_id: session.testId,
                results: answers,
            },
            false,
        );
        return result;
    }

    async getTestSentenceInBulk(
        sessionId: string,
        options?: SentenceQueryOptions,
    ): Promise<
        ServiceResult<{
            total_count?: number;
            test?: TestExamination & {
                total_count?: number;
                sentences?: SentenceDTO[];
            };
        }>
    > {
        options = options ?? {start: 0};
        const session = (await this.cacheManager.get(sessionId)) as TestSession;
        if (!session) {
            return ERRORS.TestSessionNotEstablished;
        }
        const result = await this.testService.getTestWithSentences(
            session.testId,
            options,
        );
        if (result.error) {
            return result as any;
        }
        const { data } = result;
        data.test.sentences = data.test.sentences.map((sentence, index) => ({
            ...sentence,
            user_answer: session.userAnswers[options.start + index].userAnswer,
        }));
        return { code: 0, data: data }
    }

    async getTestSentenceById(
        sessionId: string,
        sentenceId: string,
    ): Promise<
        ServiceResult<{
            sentence: Sentence;
            sessionId: string;
            userAnswer: number;
            expiredIn: string;
        }>
    > {
        const [testSession, sentence] = await Promise.all([
            this.cacheManager.get(sessionId) as Promise<TestSession>,
            this.sentenceService.getSentenceById(
                sentenceId,
            ) as Promise<Sentence>,
        ]);
        if (!testSession || !sentence) {
            if (!testSession) {
                return null;
            }
            return ERRORS.QuestionNotFound;
        }
        return {
            code: 0,
            data: {
                sessionId: testSession.sessionId,
                sentence,
                userAnswer: testSession.userAnswers.filter(
                    (answer) => answer.sentenceId === sentenceId,
                )?.[0]?.userAnswer,
                expiredIn: testSession.expired
                    ? new SessionTimer(
                          testSession.expired - Date.now(),
                      ).toString()
                    : null,
            },
        };
    }

    async getTestSentenceByIndex(
        sessionId: string,
        index: number,
    ): Promise<
        ServiceResult<{
            sentence: Sentence;
            sessionId: string;
            userAnswer: number;
            expiredIn: string;
        }>
    > {
        const testSession = (await this.cacheManager.get(
            sessionId,
        )) as TestSession;
        if (!testSession) {
            return null;
        }
        const result = await this.testService.getSentenceByIndex(
            testSession.testId,
            index,
        );
        if (result.error) {
            return result as ServiceResult<any>;
        }
        const { data: sentence } = result;
        return {
            code: 0,
            data: {
                sessionId: testSession.sessionId,
                sentence,
                userAnswer: testSession.userAnswers[index].userAnswer,
                expiredIn: testSession.expired
                    ? new SessionTimer(
                          testSession.expired - Date.now(),
                      ).toString()
                    : null,
            },
        };
    }

    async updateSentenceResult(
        sessionId: string,
        sentenceId: string,
        answer: number,
    ): Promise<
        ServiceResult<{ expiredIn: SessionTimer; session: TestSession }>
    > {
        const testSession = (await this.cacheManager.get(
            sessionId,
        )) as TestSession;

        if (!testSession) {
            return ERRORS.TestSessionNotEstablished;
        }
        if (this.isTestExpired(testSession)) {
            return ERRORS.TestSessionTimeExpired;
        }
        const sentence = testSession.userAnswers.find(
            (sentence) => sentence.sentenceId === sentenceId,
        );
        if (!sentence) {
            return ERRORS.QuestionNotFound;
        }
        if (sentence.userAnswer === -1) {
            testSession.countAnswer++;
        }
        sentence.userAnswer = answer;
        const newSession = await this.updateSession(sessionId, testSession);
        return {
            code: 0,
            data: {
                session: newSession,
                expiredIn: testSession.expired
                    ? new SessionTimer(testSession.expired - Date.now())
                    : null,
            },
        };
    }

    async updateSentenceResultByIndex(
        sessionId: string,
        index: number,
        answer: number,
    ): Promise<
        ServiceResult<{ expiredIn: SessionTimer; session: TestSession }>
    > {
        const testSession = (await this.cacheManager.get(
            sessionId,
        )) as TestSession;

        if (!testSession) {
            return ERRORS.TestSessionNotEstablished;
        }
        if (this.isTestExpired(testSession)) {
            return ERRORS.TestSessionTimeExpired;
        }
        const sentence = testSession.userAnswers[index];
        if (!sentence) {
            return ERRORS.QuestionNotFound;
        }
        if (sentence.userAnswer === -1) {
            testSession.countAnswer++;
        }
        testSession.userAnswers[index].userAnswer = answer;
        const session = await this.updateSession(sessionId, testSession);
        return {
            code: 0,
            data: {
                session,
                expiredIn: testSession.expired
                    ? new SessionTimer(testSession.expired - Date.now())
                    : null,
            },
        };
    }

    async finishTest(
        sessionId: string,
    ): Promise<
        ServiceResult<{
            testResult: TestResult;
            sessionURL: string;
        }>
    > {
        const testSession = (await this.cacheManager.get(
            sessionId,
        )) as TestSession;
        if (!testSession) {
            return ERRORS.TestSessionNotEstablished;
        }
        const result = await this.createTestResult(testSession);
        if (result.error) {
            return {
                code: 0,
                error: result.error,
            };
        }
        return {
            code: 0,
            data: {
                testResult: result.data,
                sessionURL: this.constructSessionResultURL(testSession),
            },
        };
    }

    async deleteSession(sessionId: string) {
        await this.cacheManager.del(sessionId);
    }

    protected async createTestResult(
        testSession: TestSession,
    ): Promise<ServiceResult<TestResult>> {
        const { testId, userAnswers } = testSession;
        const results = userAnswers.map(
            (sentence) =>
                ({
                    sentence_id: sentence.sentenceId,
                    user_answer: sentence.userAnswer,
                } as SentenceResultDTO),
        );
        try {
            const result = await this.testResultService.createTestResult(
                {
                    test_id: testId,
                    results,
                },
                false,
            );
            return result;
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServiceError;
        }
    }

    protected async createSession(test: TestExamination) {
        const resultSessionId = this.createResultSessionId(test.test_id);
        const expiredCacheTimeInSeconds =
            test.limited_time === 0
                ? null
                : Date.now() + test.limited_time * 1000;
        const sessionValue = {
            sessionId: resultSessionId,
            countAnswer: 0,
            testId: test.test_id,
            title: test.title,
            expired: expiredCacheTimeInSeconds,
            userAnswers: test.list_sentence_ids.map((sentenceId) => ({
                sentenceId,
                userAnswer: -1,
            })),
        } as TestSession;
        await Promise.all([
            this.cacheManager.set(resultSessionId, sessionValue, {
                ttl: this.DEFAULT_EXPIRED_TIME,
            }),
        ]);
        return sessionValue;
    }

    protected createResultSessionId(testId: string) {
        const sessionId = `${testId}_${Date.now()}`;
        return sessionId;
    }

    protected async updateSession(sessionId: string, session: TestSession) {
        const result = await this.cacheManager.set(sessionId, session, {
            ttl: this.DEFAULT_EXPIRED_TIME,
        });
        return result;
    }

    protected isTestExpired(testSession: TestSession) {
        return testSession.expired && testSession.expired < Date.now();
    }

    protected constructSessionResultURL(session: TestSession) {
        return `${this.config.sessionURL}/${session.testId}?sid=${session.sessionId}`;
    }
}
