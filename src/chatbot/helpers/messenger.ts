import { Logger } from "@nestjs/common";
import { post } from "request";
import { ResponseMessenger } from ".";

export class Messenger {
    protected webhook_event: any; // an entry of "entry" obj return from webhook
    protected psid: string;
    public text: string;

    constructor(webhook_event, protected Log: Logger = new Logger()) {
        //cache
        this.webhook_event = webhook_event;
        //parse
        this.psid = this.webhook_event.sender.id;
        this.text = this.webhook_event.message.text.trim().toLowerCase();
        //debug
        this.Log.debug(this.webhook_event, `sender id: ${this.psid}, event`);
    }

    public reply(msg: ResponseMessenger, call_back = undefined) {
        let data = msg.pack()
        data.recipient = { id: this.psid }
        this.Log.debug(data, "reply")
        post(
            {
                uri: process.env.FACEBOOK_HOOK_URI,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: data,
            },
            (err, res, body) => {
                if (err) this.Log.error(err, "Unable to send message");
                else call_back?.(res, body);
            },
        );
    }
}