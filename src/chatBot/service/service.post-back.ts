import { Injectable, Logger } from "@nestjs/common";
import { TaskMenu } from "./task/TaskMenu";
import { TaskTopic } from "./task/TaskTopic";

@Injectable()
export class PostBackService {
    private readonly logTag = "[PostBackService]"

    constructor(
        protected readonly Log: Logger,
        protected readonly taskMenu: TaskMenu,
        protected readonly taskTopic: TaskTopic,
    ) { }

    public handler(payload: string) {
        let obj
        if (payload.startsWith("{"))
            obj = JSON.parse(payload)
        else
            obj = payload

        if (obj.menu)
            return this.taskMenu.handler(obj.menu)
        // else if (obj.topic)
        //     return this.taskTopic.handler(obj.topic)
        else
            this.Log.warn(obj, `${this.logTag} unhandler payload`)
    }
}
