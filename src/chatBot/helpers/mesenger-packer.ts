import { AttachmentElement, QuickRepliesMessengerDTO, ResponseMessengerDTO, SimpleTextDTO } from "../";

interface MessengerObject {
    recipient: {
        id: string
    },
    messaging_type?: string
    message?: any
    attachment?: any[]
}

export abstract class ResponseMessenger {
    protected args: any[]
    constructor(
        protected data: ResponseMessengerDTO,
        protected readonly callback?: Function,
        ...args: any[]
    ) {
        this.args = args;
    }

    public pack() {
        return {
            messaging_type: "RESPONSE"
        } as MessengerObject
    }

    public async onSendComplete() {
        if (this.callback == null)
            return null
        let [ret, wait] = await Promise.all([this.handleCallback(), this.simpleWait(0.5)])
        return ret;
    }
    private async handleCallback() {
        if (this.callback) {
            let isAsync = this.callback.constructor.name === "AsyncFunction"
            if (isAsync)
                return await this.callback.apply(null, this.args)
            else
                return this.callback.apply(null, this.args)
        }
    }
    private async simpleWait(second) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(null), second * 1000)
        })
    }

    protected copyCleanObject<T>(o: T, bonus = {}) {
        if (typeof o !== 'object')
            return o

        let f = (o, key, value) => {
            if (o[key] == null)
                o[key] = value
        }

        let r = { ...bonus }
        for (let key in o)
            if (o[key] != null)
                f(r, key, this.copyCleanObject(o[key]))

        if (Array.isArray(o))
            r = Object.values(r)

        return r as T
    }

    protected getText(text: string | string[]) {
        if (!Array.isArray(text))
            return text
        let ret = "", len = text.length
        for (let i = 0; i < len - 1; i++)
            ret += text[i] + "\n"
        ret += text[len - 1]
        return ret
    }
}

abstract class FixPayloadMessenger extends ResponseMessenger {
    protected fixPayload(payload) {
        if (typeof payload !== "string")
            payload = JSON.stringify(payload)
        return payload
    }
}

abstract class ButtonAbleMessenger extends FixPayloadMessenger {
    protected updateButton(button) {
        if (button.url)
            button.type = "web_url"
        else if (button.payload) {
            button.type = "postback"
            button.payload = this.fixPayload(button.payload)
        }
        return button
    }
}

export class SimpleText extends ResponseMessenger {
    constructor(protected data: SimpleTextDTO, callback?: Function, ...args) {
        super(data, callback, ...args)
    }

    public pack() {
        let ret = super.pack()
        ret.message = { text: this.getText(this.data.text) }
        return ret;
    }
}

export class QuickRepliesMessenger extends FixPayloadMessenger {
    constructor(protected data: QuickRepliesMessengerDTO, callback?: Function, ...args) {
        super(data, callback, ...args)
    }

    public pack() {
        let ret = super.pack()
        ret.message = {
            text: this.getText(this.data.text),
            quick_replies: []
        }
        this.data.buttons.length = Math.min(this.data.buttons.length, 13) // https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
        this.data.buttons.forEach(e => { ret.message.quick_replies.push(this.copyCleanObject(e, { content_type: "text" })) })
        ret.message.quick_replies.forEach(e => e.payload = this.fixPayload(e.payload))
        return ret
    }
}

export class GenericMessenger extends ButtonAbleMessenger {
    constructor(protected data: AttachmentElement[], callback?: Function, ...args) {
        super(data, callback, ...args)
    }

    public pack() {
        let ret = super.pack()
        ret.message = {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: []
                }
            }
        }
        this.data.forEach(e => { ret.message.attachment.payload.elements.push(this.copyCleanObject(e)) })
        ret.message.attachment.payload.elements.forEach(e => {
            if (e.subtitle)
                e.subtitle = this.getText(e.subtitle)
            if (e.buttons) {
                e.buttons.length = Math.min(e.buttons.length, 3) // https://developers.facebook.com/docs/messenger-platform/send-messages/template/generic
                e.buttons.forEach(button => this.updateButton(button))
            }
            if (e.default_action) {
                e.default_action.type = "web_url"
                e.default_action.messenger_extensions = false
                e.default_action.webview_height_ratio = e.default_action.webview_height_ratio || "FULL"
            }
        })
        return ret
    }

}