import { AttachmentElement, QuickRepliesMessengerDTO, ResponseMessengerDTO, SimpleTextDTO } from "../dto";

interface MessengerObject {
    recipient: {
        id: string
    },
    messaging_type?: string
    message?: any
    attachment?: any[]
}

export abstract class ResponseMessenger {
    constructor(protected data: ResponseMessengerDTO) {
    }

    public pack() {
        return {
            messaging_type: "RESPONSE"
        } as MessengerObject
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
}

abstract class ButtonAbleMessenger extends ResponseMessenger {
    protected updateButton(button) {
        if (button.url)
            button.type = "web_url"
        else if (button.payload)
            button.type = "postback"
        return button
    }
}

export class SimpleText extends ResponseMessenger {
    constructor(protected data: SimpleTextDTO) {
        super(data)
    }

    public pack() {
        let ret = super.pack()
        ret.message = { text: this.data.text }
        return ret;
    }

}

export class QuickRepliesMessenger extends ResponseMessenger {
    constructor(protected data: QuickRepliesMessengerDTO) {
        super(data)
    }

    public pack() {
        let ret = super.pack()
        ret.message = {
            text: this.data.text,
            quick_replies: []
        }
        this.data.buttons.forEach(e => { ret.message.quick_replies.push(this.copyCleanObject(e, { content_type: "text" })) })
        return ret
    }
}

export class GenericMessenger extends ButtonAbleMessenger {
    constructor(protected data: AttachmentElement[]) {
        super(data)
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
            e.buttons?.forEach(button => this.updateButton(button))
            if (e.default_action) {
                e.default_action.type = "web_url"
                e.default_action.messenger_extensions = false
                e.default_action.webview_height_ratio = e.default_action.webview_height_ratio || "FULL"
            }
        })
        return ret
    }

}