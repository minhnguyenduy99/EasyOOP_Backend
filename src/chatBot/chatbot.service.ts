import { Injectable, Logger } from "@nestjs/common";
import { ResponseMessenger } from "./helpers/mesenger-packer";
import { Messenger } from "./helpers/messenger";
import { PostBackService } from "./service/service.post-back";
import { ReceiveMessageService } from "./service/service.receive-message";

@Injectable()
export class ChatbotService {
    private readonly logTag = "[ChatbotService]"

    constructor(
        protected readonly Log: Logger,
        protected readonly postBackService: PostBackService,
        protected readonly receiveMessageService: ReceiveMessageService,
    ) { }

    public async handle(text: string) {
        this.Log.debug({ t: await this.receiveMessageService.handler(text) }, `${this.logTag}`)
    }

    public async handleRaw(webhook_event) {
        let msg = new Messenger(webhook_event, this.Log)
        let reply = null as ResponseMessenger | ResponseMessenger[]

        if (webhook_event.postback)
            reply = await this.postBackService.handler(webhook_event.postback)
        else if (webhook_event.message) {
            if (webhook_event.message.quick_reply)
                reply = await this.postBackService.handler(webhook_event.message.quick_reply)
            else if (webhook_event.message.text)
                reply = await this.receiveMessageService.handler(webhook_event.message.text)
        }

        if (reply) {
            if (!Array.isArray(reply))
                reply = [reply]
            reply.forEach(e => msg.reply(e))
        } else
            this.Log.warn(webhook_event, `${this.logTag} unhandler webhook event`)
    }
}