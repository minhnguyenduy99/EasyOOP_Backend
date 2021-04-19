import { Injectable, Logger } from "@nestjs/common";
import { ResponseMessenger } from "src/chatbot/helpers/mesenger-packer";
import { NLPService, Label, INLPResult } from "src/lib/nlp";
import { TaskMenu } from "./TaskMenu";
import { TaskTopic } from "./TaskTopic";
import { TaskWelcome } from "./TaskWelcome";

@Injectable()
export class TaskNLP {
    private readonly logTag = "[TaskNLP]"

    constructor(
        protected readonly Log: Logger,
        protected readonly NLP: NLPService,
        protected readonly taskWelcome: TaskWelcome,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskTopic: TaskTopic,
    ) { }

    public async handler(text) {
        const res = await this.NLP.get(text, { fixMissing: true })
        let tasks = []
        res.forEach(e => tasks.push(this.getTask(e)))
        let ret = await Promise.all(tasks)
        for (let i = tasks.length - 1; i >= 0; i--)
            if (!ret[i])
                ret.splice(i, 1)
        return ret as ResponseMessenger[]
    }

    private getTask(task: INLPResult) {
        this.Log.debug(task)
        if (task.type.length == 0) {
            this.unhandlerTask(task)
            return
        }
        
        let type = task.type[0].label
        switch (Label.type[type]) {
            case Label.type.__label__welcome:
                return this.taskWelcome.handler()
            case Label.type.__label__menu:
                return this.taskMenu.handler()
            case Label.type.__label__definition:
            case Label.type.__label__example:
            case Label.type.__label__exercise:
                if (task.topic.length == 0) {
                    this.unhandlerTask(task)
                    return
                }
                return this.taskTopic.handler(type, task.topic[0].label, task.raw)
            default:
                this.unhandlerTask(task)
                return
        }
    }

    private unhandlerTask(task: INLPResult) {
        this.Log.warn(task, `${this.logTag} unhandler task`)
    }
}