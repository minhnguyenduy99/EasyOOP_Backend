import { Injectable } from "@nestjs/common";
import { TaskCacheService } from "./service.task-cache";
import { ITask } from "./task";
import { TaskMenu } from "./task/TaskMenu";
import { TaskNLP } from "./task/taskNLP";
import { TaskWelcome } from "./task/TaskWelcome";

@Injectable()
export class ReceiveMessageService {
    constructor(
        protected readonly taskWelcome: TaskWelcome,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskNLP: TaskNLP,
        protected readonly taskCacheService: TaskCacheService
    ) { }

    async handler(content: string, psid: string) {
        let nextTask = this.taskCacheService.checkThenPopTask(psid);
        if (nextTask)
            return nextTask.task.handlerAny(content, ...nextTask.args)

        if (content == "?" || content == "help")
            return this.taskWelcome.handler()
        else if (content == "menu")
            return this.taskMenu.handler()
        else
            return this.taskNLP.handler(content, psid)
    }
}