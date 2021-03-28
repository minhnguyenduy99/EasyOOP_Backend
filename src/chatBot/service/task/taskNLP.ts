import { SimpleText } from "src/chatbot/helpers";
import { NLP } from "src/lib/nlp";
import { BaseMessageHandler } from "..";

export class TaskNLP extends BaseMessageHandler {
    handler() {
        let ret = NLP.type.getClassifications(this.body)
        this.msg.reply(new SimpleText({ text: `you mean ${ret.label} right?`}))
    }
}