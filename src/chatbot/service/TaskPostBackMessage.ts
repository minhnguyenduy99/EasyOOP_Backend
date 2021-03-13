import { SimpleText } from "../helpers";
import { BaseMessageHandler } from ".";

export class TaskPostBackMessage extends BaseMessageHandler {
    handler() {
        this.Log.log(JSON.stringify(this.body))

        let payload = this.body.payload
        switch (payload) {
            case "yes":
                this.msg.reply(new SimpleText({ text: 'you choise yes' }))
                return
            case "no":
                this.msg.reply(new SimpleText({ text: 'you choise no' }))
                return
        }
    }
}
