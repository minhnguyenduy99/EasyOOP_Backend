import { NLP, Label } from "src/lib/nlp";
import { TaskTopic, TaskWelcome } from ".";
import { BaseMessageHandler } from "..";
import { TaskMenu } from "./TaskMenu";

export class TaskNLP extends BaseMessageHandler {
    static flow = {}

    handler() {
        NLP.type.getClassifications(this.body).then((ret) => {
            this.getTaskByLabel(ret[0].label).handler();
        })
        // this.msg.reply(new SimpleText({ text: `you mean ${ret.label} right?` }))
    }

    private getTaskByLabel(label: string): BaseMessageHandler {
        switch (label) {
            case Label.type.__label__welcome:
                return new TaskWelcome(this.msg);
            case Label.type.__label__menu:
                return new TaskMenu(this.msg);
            default:
                return new TaskTopic(this.msg, this.body, label)
        }
    }
}