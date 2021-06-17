import { Injectable, Logger } from "@nestjs/common";
import { ResponseMessenger } from "src/chatbot/helpers/mesenger-packer";
import { NLPService, Label, INLPResult, constant } from "src/lib/nlp";
import { ITask } from "./ITask";
import { TaskExercise } from "./TaskExercise";
import { TaskLogin } from "./TaskLogin";
import { TaskMenu } from "./TaskMenu";
import { TaskQnA } from "./TaskQnA";
import { TaskTopic } from "./TaskTopic";
import { TaskWelcome } from "./TaskWelcome";

@Injectable()
export class TaskNLP implements ITask {
    private readonly logTag = "[TaskNLP]"

    constructor(
        protected readonly taskExercise: TaskExercise,
        protected readonly Log: Logger,
        protected readonly NLP: NLPService,
        protected readonly taskLogin: TaskLogin,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskTopic: TaskTopic,
        protected readonly taskWelcome: TaskWelcome,
        protected readonly taskQnA: TaskQnA
    ) { }
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.handler.apply(this, [content, ...args])
    }

    public async handler(text: string, psid?: string) {
        const regular = await this.NLP.getRegular(text);
        switch (Label.type[regular]) {
            case Label.type.__label__login:
                return this.taskLogin.handle(psid);
            case Label.type.__label__menu:
                return this.taskMenu.handler()
            case Label.type.__label__welcome:
                return this.taskWelcome.handler()
            default:
                this.unhandlerTask(regular)
        }

        const res = await this.NLP.get(text, { fixMissing: true })
        let tasks = []
        res.forEach(e => tasks.push(this.getTask(e, psid)))
        let ret = await Promise.all(tasks)
        for (let i = tasks.length - 1; i >= 0; i--)
            if (!ret[i])
                ret.splice(i, 1)
        return ret as ResponseMessenger[]
    }

    private getTask(task: INLPResult, psid?: string) {
        this.Log.debug(task)
        if (task.type.length == 0) {
            this.unhandlerTask(task)
            return
        }

        let type = task.type[0].label
        switch (Label.type[type]) {
            case Label.type.__label__question:
            case Label.type.__label__example:
                if (task.topic.length == 0) {
                    this.unhandlerTask(task)
                    return
                }
                return this.taskTopic.handler(type, task.topic[0].label, task.raw)
            case Label.type.__label__exercise:
                if (task.topic[0].value > constant.trustThreshold)
                    return this.taskExercise.searchTest(psid, task.topic[0].label)
                else
                    return this.taskExercise.askWhatTest(psid)
            default:
                this.unhandlerTask(task)
                return
        }
    }

    private unhandlerTask(task: INLPResult | string) {
        this.Log.warn(task, `${this.logTag} unhandler task`)
    }
}