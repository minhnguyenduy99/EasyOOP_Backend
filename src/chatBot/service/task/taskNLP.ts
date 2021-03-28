import { NLP, Label } from "src/lib/nlp";
import { TaskTopic, TaskWelcome } from ".";
import { BaseMessageHandler } from "..";
import { TaskMenu } from "./TaskMenu";

export class TaskNLP extends BaseMessageHandler {
    static flow = {}

    handler() {
        let ret = NLP.type.getClassifications(this.body)[0];
        this.getTaskByLabel(ret.label).handler();
        // this.msg.reply(new SimpleText({ text: `you mean ${ret.label} right?` }))
    }

    private getTaskByLabel(label: string): BaseMessageHandler {
        switch (label) {
            case Label.type.welcome:
                return new TaskWelcome(this.msg);
            case Label.type.menu:
                return new TaskMenu(this.msg);
            default:
                return new TaskTopic(this.msg, this.body, label)
        }
    }
}