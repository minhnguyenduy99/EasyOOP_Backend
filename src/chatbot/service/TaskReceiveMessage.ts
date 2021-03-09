import { MessengerBuilder } from "../helpers";
import { BaseMessageHandler } from "./BaseMessageHandler";
import { TaskHelpMessage } from "./task";

export class TaskReceiveMessage extends BaseMessageHandler {
    handler() {
        let content = this.body.text.trim()
        let task
        if (content == "?" || content == "help")
            task = new TaskHelpMessage(this.msg)

        task?.handler();
    }
}
