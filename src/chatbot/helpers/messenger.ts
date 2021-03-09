import { Logger } from "@nestjs/common";
import { POINT_CONVERSION_COMPRESSED } from "node:constants";
import { post } from "request";
import { TaskPostBackMessage, TaskReceiveMessage } from "../service";

export class Messenger {
    protected webhook_event: any;
    protected psid: string;

    constructor(webhook_event, private Log: Logger = new Logger()) {
        //cache
        this.webhook_event = webhook_event;
        //parse
        this.psid = this.webhook_event.sender.id;

        //debug
        // this.Log.debug("event", this.webhook_event, "sender id", this.psid);
    }

    reply(content, call_back = undefined) {
        let rep_body = {
            recipient: {
                id: this.psid,
            },
            message: {
                text: content,
            },
        };
        post(
            {
                uri: process.env.FACEBOOK_HOOK_URI,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: rep_body,
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
