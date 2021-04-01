import { BaseMessageHandler } from ".";
import { TaskMenu, TaskNLP, TaskWelcome } from "./task";

export class TaskReceiveMessage extends BaseMessageHandler {
    handler() {
        let content = this.body.text.trim().toLowerCase();
        let task
        if (content == "?" || content == "help")
            task = new TaskWelcome(this.msg)
        else if (content == "menu")
            task = new TaskMenu(this.msg);
        else
            task = new TaskNLP(this.msg, content)
        task?.handler();
    }
}
