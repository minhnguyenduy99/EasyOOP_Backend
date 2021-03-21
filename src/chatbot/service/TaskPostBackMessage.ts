import { SimpleText } from "../helpers";
import { BaseMessageHandler } from ".";
import { TaskMenu } from "./task";

export class TaskPostBackMessage extends BaseMessageHandler {
    public static readonly prefix = "P"

    handler() {
        this.Log.log(JSON.stringify(this.body))
        let payload = this.body.payload
        let prefix = payload[0]

        let task;

        if (prefix == TaskPostBackMessage.prefix)
            task = new TaskMenu(this.msg, payload)
        else
            switch (payload) {
                case "yes":
                    this.msg.reply(new SimpleText({ text: 'you choise yes' }))
                    return
                case "no":
                    this.msg.reply(new SimpleText({ text: 'you choise no' }))
                    return
            }
        task?.handler()
    }
}
