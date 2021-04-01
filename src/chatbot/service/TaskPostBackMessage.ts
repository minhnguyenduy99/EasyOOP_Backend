import { SimpleText } from "../helpers";
import { BaseMessageHandler } from ".";
import { TaskMenu, TaskTopic } from "./task";

export class TaskPostBackMessage extends BaseMessageHandler {
    handler() {
        let payload = this.body.payload
        if (payload.startsWith("{"))
            payload = JSON.parse(payload)

        this.Log.log(payload)

        let task;
        if (payload.menu)
            task = new TaskMenu(this.msg, payload.menu)
        else if (payload.topic)
            task = new TaskTopic(this.msg, payload.topic)

        task?.handler()
    }
}
