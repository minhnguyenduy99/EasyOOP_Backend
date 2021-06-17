import { Injectable } from "@nestjs/common"
import { ResponseMessenger, SimpleText } from "src/chatbot/helpers/mesenger-packer"
import { ITask } from "./ITask"
import Lang from "./Lang"

@Injectable()
export class TaskQnA implements ITask {
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.handler()
    }

    async handler() {
        return new SimpleText({
            text: [
                Lang.get(Lang.txt_about1),
                Lang.get(Lang.txt_about2),
                "• Backend: https://github.com/minhnguyenduy99/EasyOOP_Backend",
                "• Frontend: https://github.com/minhnguyenduy99/EasyOOP-frontend",
                "• Train bot: https://github.com/LichND/NLP",
                Lang.get(Lang.txt_about3),
            ]
        })
    }

    async onHelp() {
        return new SimpleText({
            text: [
                Lang.get(Lang.txt_QnA_help1),
                Lang.get(Lang.txt_QnA_help2),
            ]
        })
    }
}