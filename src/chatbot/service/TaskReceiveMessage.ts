import { BaseMessageHandler } from "./BaseMessageHandler";

export class TaskReceiveMessage extends BaseMessageHandler {
    handler() {
        let content = this.body["text"];
        this.msg.reply(`Hello? you said ${content}?`);
    }
}
