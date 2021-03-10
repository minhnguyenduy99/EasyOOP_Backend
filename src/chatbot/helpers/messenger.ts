import { Logger } from "@nestjs/common";
import { post } from "request";
import { MessengerBuilder } from ".";
import { ResponseMessager } from "../dto";
import { TaskPostBackMessage, TaskReceiveMessage } from "../service";

export class Messenger {
    protected webhook_event: any; // an entry of "entry" obj return from webhook
    protected psid: string;

    constructor(webhook_event, protected Log: Logger = new Logger()) {
        //cache
        this.webhook_event = webhook_event;
        //parse
        this.psid = this.webhook_event.sender.id;

        //debug
        this.Log.log(`event: ${this.webhook_event} | sender id: ${this.psid}`);
    }

    reply(data: ResponseMessager, call_back = undefined) {
        post(
            {
                uri: process.env.FACEBOOK_HOOK_URI,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: new MessengerBuilder().set(data).build(this.psid),
            },
            (err, res, body) => {
                if (err) this.Log.error("Unable to send message", err);
                else call_back?.(res, body);
            },
        );
    }

    handler() {
        let task;
        if (this.webhook_event.message)
            task = new TaskReceiveMessage(this, this.webhook_event.message);
        else if (this.webhook_event.postback)
            task = new TaskPostBackMessage(this, this.webhook_event.postback);

        task && task.handler();
    }
}
