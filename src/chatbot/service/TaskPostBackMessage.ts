import { BaseMessageHandler } from "./BaseMessageHandler";

export class TaskPostBackMessage extends BaseMessageHandler {
    handler() {
        this.Log.log(JSON.stringify(this.body))

        let payload = this.body.payload
        switch (payload) {
            case "yes":
                this.msg.reply({ text: 'you choise yes' })
                return
            case "no":
                this.msg.reply({ text: 'you choise no' })
                return
        }
    }
}
