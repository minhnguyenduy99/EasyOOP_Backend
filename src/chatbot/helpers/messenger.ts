import { Logger } from "@nestjs/common";
import { post } from "request";
import { ResponseMessenger } from ".";

export class Messenger {
    private logTag = "[Messenger]"
    private readonly delayTime = 0.5
    protected webhook_event: any; // an entry of "entry" obj return from webhook
    protected _psid: string;
    public text: string;

    constructor(webhook_event, protected Log: Logger = new Logger()) {
        //cache
        this.webhook_event = webhook_event
        //parse
        this._psid = this.webhook_event.sender.id
        if (webhook_event.postback)
            this.text = webhook_event.postback.title
        else if (this.webhook_event.message)
            this.text = this.webhook_event.message.text.trim().toLowerCase()
        //debug
        this.Log.debug(this.webhook_event, `sender id: ${this._psid}, event`)
    }

    public reply(msg: ResponseMessenger, call_back = undefined) {
        let data = msg.pack()
        data.recipient = { id: this._psid }
        this.Log.debug(data, "reply")
        let that = this
        post(
            {
                uri: process.env.FACEBOOK_HOOK_URI,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: data,
            },
            (err, res, body) => {
                if (err)
                    this.Log.error(err, "Unable to send message");
                else {
                    call_back?.(res, body);
                    msg.onSendComplete().then(ret => {
                        if (ret && ret instanceof ResponseMessenger)
                            that.reply(ret);
                    }).catch(err => this.Log.error(this.logTag + err, err.trace))
                }
            }
        )
    }

    get psid() {
        return this._psid;
    }
}