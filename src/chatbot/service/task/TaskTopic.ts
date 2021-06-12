import { Injectable } from "@nestjs/common";
import { AttachmentElement } from "src/chatbot";
import { GenericMessenger, ResponseMessenger, SimpleText } from "src/chatbot/helpers/mesenger-packer";
import { IntegrationService } from "src/chatbot/integration/service";
import { Label } from "src/lib/nlp";
import { ITask } from "./ITask";
import { TaskUnknow } from "./TaskUnknow";

@Injectable()
export class TaskTopic implements ITask {
    constructor(
        protected readonly integrationService: IntegrationService,
        protected readonly taskUnknow: TaskUnknow
    ) { }
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.handler.call(this, args)
    }

    public async handler(type: string, topic: string, raw) {
        const ret = await this.integrationService.getResultByTag({ type: Label.type[type], value: Label.topic[topic] })
        if (!ret || ret.length == 0)
            return this.taskUnknow.handler()
        else if (ret.length == 1 && ret[0].url == null)
            return new SimpleText({ text: ret[0].text })
        else {
            let rep = [] as AttachmentElement[]
            ret.forEach(e => {
                let p = {
                    title: e.title || raw,
                    subtitle: e.text
                } as AttachmentElement
                if (e.image) {
                    p.image_url = e.image
                    if (e.url)
                        p.default_action = {
                            url: e.url,
                            webview_height_ratio: "FULL"
                        }
                }
                rep.push(p);
            })
            return new GenericMessenger(rep)
        }
    }
}