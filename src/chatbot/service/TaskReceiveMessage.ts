import { BaseMessageHandler } from ".";
import { TaskHelpMessage, TaskMenu, TaskNLP } from "./task";

export class TaskReceiveMessage extends BaseMessageHandler {
    handler() {
        let content = this.body.text.trim().toLowerCase();
        let task
        if (content == "?" || content == "help")
            task = new TaskHelpMessage(this.msg)
        else if (content == "menu")
            task = new TaskMenu(this.msg, null);
        else
            task = new TaskNLP(this.msg, content)
        task?.handler();
    }
}
