import { BaseMessageHandler } from "./BaseMessageHandler";

export class TaskPostBackMessage extends BaseMessageHandler {
    handler() {
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
