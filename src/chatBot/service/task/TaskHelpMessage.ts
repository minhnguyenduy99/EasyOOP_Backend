import { ResponseMessager } from "src/chatbot/dto";
import { BaseMessageHandler } from "../BaseMessageHandler";


export class TaskHelpMessage extends BaseMessageHandler {
    constructor(msg) {
        super(msg, null)
    }

    handler() {
        this.msg.reply({
            title: "Đây là title",
            subtitle: "Đây là subtitle",
            buttons: [
                {
                    title: "yes!",
                    payload: "yes"
                },
                {
                    title: "no!",
                    payload: "no"
                }
            ]
        } as ResponseMessager)
    }

}