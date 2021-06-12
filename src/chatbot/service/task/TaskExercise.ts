import { Injectable, Logger } from "@nestjs/common";
import { AttachmentElement, QuickRepliesMessengerDTO } from "src/chatbot";
import { GenericMessenger, QuickRepliesMessenger, ResponseMessenger, SimpleText } from "src/chatbot/helpers";
import { TestExaminationService, TestSessionService } from "src/test-examination/core";
import { TestSession } from "src/test-examination/core/services/test-session-service/interfaces";
import { SessionTimer } from "src/test-examination/core/services/test-session-service/timer";
import { TaskCacheService } from "../service.task-cache";
import { ITask } from "./ITask";
import { default as Lang } from "./Lang"
import { TaskID } from "./taskID";
import { TaskLogin } from "./TaskLogin";

@Injectable()
export class TaskExercise implements ITask {
    private readonly logTag = "[TaskExercise]"
    private readonly pageNum = 5
    private static readonly markChoise = ["🔴", "🔵", "🟡", "🟢", "🟤", "🟣", "🟠", "⚪", "⚫", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    private static readonly markAnswer = ["🟥", "🟦", "🟨", "🟩", "🟫", "🟪", "🟧", "⬜", "⬛", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    private static readonly markSkip = "⏭️"
    private static readonly markBackToChoise = "⬆️"
    private static readonly check = "✔️"
    constructor(
        private readonly Log: Logger,
        private readonly taskLogin: TaskLogin,
        private readonly testExaminationService: TestExaminationService,
        private readonly testSessionService: TestSessionService,
        private readonly taskCacheService: TaskCacheService
    ) { }

    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.searchTest.apply(this, [...args, content])
    }

    public async searchTest(psid: string, topic: string) {
        let isLogin = true // TODO: check if user is login
        if (!isLogin)
            return this.taskLogin.handle(psid)
        else {
            let res = await this.testExaminationService.searchTest({
                title: topic,
                verifying_status: 1
            }, {}) // TODO: remove

            if (res.count == 0)
                return new SimpleText({ text: Lang.get(Lang.txt_exerciseNotFound) })

            let data = [] as AttachmentElement[]
            res.results.forEach(e => {
                let push = {
                    title: e.title
                } as AttachmentElement
                push.subtitle = []
                if (e.list_sentence_ids) {
                    push.subtitle.push(Lang.get(Lang.txt_ExerciseNQuestion, e.list_sentence_ids.length))
                }
                if (e.limited_time) {
                    push.subtitle.push(Lang.get(Lang.txt_ExerciseTime, SessionTimer.parse(e.limited_time)))
                }
                if (push.subtitle.length === 0)
                    delete push.subtitle

                push.buttons = [
                    {
                        title: Lang.get(Lang.txt_ExerciseDoNow),
                        payload: {
                            tid: TaskID.Test,
                            args: [psid, e.test_id, e.limited_time ? e.limited_time : -1, e.list_sentence_ids.length]
                        }
                    },
                    {
                        title: Lang.get(Lang.txt_ExerciseHelpThenDoNow),
                        payload: {
                            tid: TaskID.TestHelp,
                            args: [psid, e.test_id, e.limited_time ? e.limited_time : -1, e.list_sentence_ids.length]
                        }
                    }
                ]
                data.push(push)
            })

            return new GenericMessenger(data)
        }
    }

    public async askWhatTest(psid: string) {
        this.taskCacheService.setNextTask(this, psid, psid)
        return new SimpleText({ text: Lang.get(Lang.txt_ExerciseSearchText) })
    }

    private async _getTestSession(psid: string) {
        return this.__cacheSession[psid]
    }
    private async _onTesting(psid: string, test_id: string, num: number) {
        return new SimpleText({
            text: [
                Lang.get(Lang.txt_ExerciseOnTest1),
                Lang.get(Lang.txt_ExerciseOnTest2),
            ]
        }, this._onChoosePage.bind(this), psid, test_id, 0, num)
    }

    private async _testHelp(psid: string, test_id: string, limited_time: number, num: number) {
        if (await this._getTestSession(psid))
            return this._onTesting(psid, test_id, num)

        // help message
        return new QuickRepliesMessenger({
            text: [
                Lang.get(Lang.txt_ExerciseHelp1),
                Lang.get(Lang.txt_ExerciseHelp2),
                Lang.get(Lang.txt_ExerciseHelp3, Lang.txt_ExerciseSubmit),
                Lang.get(Lang.txt_ExerciseHelp4, Lang.txt_ExercisePrevious, Lang.txt_ExerciseNext),
                Lang.get(Lang.txt_ExerciseHelp5, TaskExercise.check),
                Lang.get(Lang.txt_ExerciseHelp6),
                Lang.get(Lang.txt_ExerciseHelp7),
                Lang.get(Lang.txt_ExerciseHelp8, TaskExercise.markSkip),
                Lang.get(Lang.txt_ExerciseHelp9, TaskExercise.markBackToChoise),
                Lang.get(Lang.txt_ExerciseHelp10, Lang.txt_ExerciseReady),
            ],
            buttons: [
                {
                    title: Lang.get(Lang.txt_ExerciseReady),
                    payload: {
                        tid: TaskID.Test,
                        args: [psid, test_id, limited_time ? limited_time : -1, num]
                    }
                }
            ]
        })
    }
    public async testHelp(...args) {
        return this._testHelp.apply(this, args)
    }
    private async _startTest(psid: string, test_id: string, limited_time: number, num: number) {
        if (await this._getTestSession(psid))
            return this._onTesting(psid, test_id, num)

        let text = [Lang.get(Lang.txt_ExerciseNQuestion, num)]
        limited_time > 0 && text.push(Lang.get(Lang.txt_ExerciseTimeAndCount, SessionTimer.parse(limited_time)))
        return new SimpleText({ text: text }, this.startTimerTest.bind(this), psid, test_id, num)
    }
    public async startTest(...args) {
        return this._startTest.apply(this, args)
    }

    private __cacheSession = {}
    private async startTimerTest(psid: string, test_id: string, num: number) {
        let res = await this.testSessionService.createTestSession({ testId: test_id })
        this.__cacheSession[psid] = res.data
        return this._onChoosePage(psid, test_id, 0, num)
    }

    private async _onChoosePage(psid: string, test_id: string, page: number, total: number) {
        let session = this.__cacheSession[psid] as TestSession
        let checkEnd = await this.checkEndTest(session, psid)
        if (checkEnd)
            return checkEnd

        let start = this.pageNum * page
        let end = Math.min(this.pageNum * (page + 1), total)

        let { data: { test: { sentences } } } = await this.testSessionService.getTestSentenceInBulk(session.sessionId, {
            start: start,
            limit: end - start
        })

        let msg = {
            text: Lang.get(Lang.txt_ExerciseChooseQuestion),
            buttons: []
        } as QuickRepliesMessengerDTO
        if (page > 0)
            msg.buttons.push({
                title: Lang.get(Lang.txt_ExercisePrevious),
                payload: {
                    tid: TaskID.ExerciseChoosePage,
                    args: [psid, test_id, page - 1, total]
                }
            })
        for (let i = start; i < end; i++)
            msg.buttons.push({
                title: Lang.get(Lang.txt_ExerciseQuestion, i + 1) + (sentences[i - start].user_answer >= 0 ? TaskExercise.check : ""),
                payload: {
                    tid: TaskID.ExerciseChooseQuestion,
                    args: [psid, test_id, i, total],
                }
            })
        if (end < total)
            msg.buttons.push({
                title: Lang.get(Lang.txt_ExerciseNext),
                payload: {
                    tid: TaskID.ExerciseChoosePage,
                    args: [psid, test_id, page + 1, total]
                }
            })
        msg.buttons.push({
            title: Lang.get(Lang.txt_ExerciseSubmit),
            payload: {
                tid: TaskID.ExerciseChooseVerifySubmit,
                args: [psid, test_id, page, total]
            }
        })
        return new QuickRepliesMessenger(msg)
    }
    public async onChoosePage(...args) {
        return this._onChoosePage.apply(this, args)
    }

    private async _onChooseQuestion(psid: string, test_id: string, questionIndex: number, total: number) {
        if (questionIndex >= total)
            return this._onChoosePage(psid, test_id, ~~(total / this.pageNum), total)
        let session = this.__cacheSession[psid] as TestSession
        let checkEnd = await this.checkEndTest(session, psid)
        if (checkEnd)
            return checkEnd
        let { data: { sentence: { question, options, }, userAnswer, expiredIn } } = await this.testSessionService.getTestSentenceByIndex(session.sessionId, questionIndex)

        let fistSignal = Lang.get(Lang.txt_ExerciseQuestion, questionIndex + 1)
        if (expiredIn)
            fistSignal += " - " + Lang.get(Lang.txt_ExerciseTimeLeft, expiredIn)
        let text = [
            fistSignal,
            ``,
            `${question}`
        ]
        let data = {
            text: text,
            buttons: []
        } as QuickRepliesMessengerDTO

        for (let i = 0, len = options.length; i < len; i++) {
            text.push(`${userAnswer === i ? TaskExercise.markAnswer[i] : TaskExercise.markChoise[i]} ${options[i]}`)
            data.buttons.push({
                title: TaskExercise.markChoise[i],
                payload: {
                    tid: TaskID.ExerciseChooseAnswer,
                    args: [psid, test_id, questionIndex, i, total]
                }
            })
        }
        data.buttons.push({ // skip, go to next question
            title: TaskExercise.markSkip,
            payload: {
                tid: TaskID.ExerciseChooseQuestion,
                args: [psid, test_id, questionIndex + 1, total]
            }
        })
        data.buttons.push({ // back to question select
            title: TaskExercise.markBackToChoise,
            payload: {
                tid: TaskID.ExerciseChoosePage,
                args: [psid, test_id, ~~(questionIndex / this.pageNum), total]
            }
        })

        return new QuickRepliesMessenger(data)
    }
    public async onChooseQuestion(...args) {
        return this._onChooseQuestion.apply(this, args)
    }

    private async _onChooseAnswer(psid: string, test_id: string, questionIndex: number, answer: number, total: number) {
        let session = this.__cacheSession[psid] as TestSession
        let checkEnd = await this.checkEndTest(session, psid)
        if (checkEnd)
            return checkEnd

        await this.testSessionService.updateSentenceResultByIndex(session.sessionId, questionIndex, answer)
        return this._onChooseQuestion(psid, test_id, questionIndex + 1, total)
    }
    public async onChooseAnswer(...args) {
        return this._onChooseAnswer.apply(this, args)
    }

    private async _onVerifySubmit(psid: string, test_id: string, page: number, total: number) {
        let session = this.__cacheSession[psid] as TestSession
        let checkEnd = await this.checkEndTest(session, psid)
        if (checkEnd)
            return this._onSubmit(psid);
        let test = await this.testSessionService.getTestSessionById(session.sessionId)
        let numAnswer = test.userAnswers.filter(e => e.userAnswer > 0).length

        return new QuickRepliesMessenger({
            text: [
                Lang.get(Lang.txt_ExerciseTimeLeft, SessionTimer.parseMs(test.expired)),
                Lang.get(Lang.txt_ExerciseCompleteQuestion, numAnswer, total),
                Lang.get(Lang.txt_ExerciseSubmitComfirm),
            ],
            buttons: [
                {
                    title: Lang.get(Lang.txt_ExerciseOK),
                    payload: {
                        tid: TaskID.ExerciseChooseSubmit,
                        args: [psid]
                    }
                },
                {
                    title: Lang.get(Lang.txt_ExerciseContinue),
                    payload: {
                        tid: TaskID.ExerciseChoosePage,
                        args: [psid, test_id, page, total]
                    }
                }
            ]
        })
    }
    public async onVerifySubmit(...args) {
        return this._onVerifySubmit.apply(this, args)
    }

    private async _onSubmit(psid: string) {
        let session = this.__cacheSession[psid] as TestSession
        delete this.__cacheSession[psid]

        let { data: { testResult, sessionURL } } = await this.testSessionService.finishTest(session.sessionId)
        return new SimpleText({
            text: [
                session.title,
                "",
                Lang.get(Lang.txt_ExerciseResultQuestion, testResult.correct_answer_count, testResult.total_sentence_count),
                Lang.get(Lang.txt_ExerciseResultScore, testResult.obtained_score, testResult.total_score),
                Lang.get(Lang.txt_ExerciseResultViewInWeb, ": " + sessionURL)
            ]
        })

        // TODO: why messenger don't allow url button?!
        return new GenericMessenger([
            {
                title: session.title,
                subtitle: [
                    Lang.get(Lang.txt_ExerciseResultQuestion, testResult.correct_answer_count, testResult.total_sentence_count),
                    Lang.get(Lang.txt_ExerciseResultScore, testResult.obtained_score, testResult.total_score),
                ],
                buttons: [
                    {
                        title: Lang.get(Lang.txt_ExerciseResultViewInWeb, ""),
                        url: sessionURL
                    }
                ]
            }
        ])
    }
    public async onSubmit(...args) {
        return this._onSubmit.apply(this, args)
    }

    private async checkEndTest(session: TestSession, psid: string) {
        if (session.expired - Date.now() < 0)
            return new SimpleText({ text: Lang.get(Lang.txt_ExerciseForceEnd) }, this._onSubmit.bind(this), psid)
        return false;
    }
}