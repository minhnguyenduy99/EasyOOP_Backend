import { Injectable } from "@nestjs/common";
import { TaskMenu } from "./task/TaskMenu";
import { TaskNLP } from "./task/taskNLP";
import { TaskWelcome } from "./task/TaskWelcome";

@Injectable()
export class ReceiveMessageService {
    constructor(
        protected readonly taskWelcome: TaskWelcome,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskNLP: TaskNLP
    ) { }

    async handler(content: string, psid?: string) {
        if (content == "?" || content == "help")
            return this.taskWelcome.handler()
        else if (content == "menu")
            return this.taskMenu.handler()
        else
            return this.taskNLP.handler(content, psid)
    }
}
