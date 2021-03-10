import { MessengerAttachment, QuickRepliesButton, ResponseMessager, ResponseMessengerButton } from "../dto"

export class MessengerBuilder {
    private body: any

    public constructor() {
        this.body = {}
    }

    public set(data: ResponseMessager) {
        data.attachment?.forEach(e => this.addAttachment(e)) // still bug

        data.quick_replies?.forEach(e => this.addQuickButton(e))
        data.buttons?.forEach(e => this.addButton(e))
        data.text && this.setText(data.text)
        return this
    }

    setText(text: string) {
        if (this.body.attachment) {
            this.body.attachment.payload.text = text
            delete this.body.text
        }
        else
            this.body.text = text
        return this
    }

    addAttachment(data: MessengerAttachment) {
        if (this.attachment.payload.template_type != "template")
            this.body.attachment.payload = {
                template_type: "generic",
                elements: []
            }

        let formatButton = this.copyCleanObject(data.buttons)
        formatButton.forEach(e => e["type"] = "postback")
        this.body.attachment.payload.elements.push(this.copyCleanObject(data, { buttons: formatButton }))
        return this
    }

    addButton(data: ResponseMessengerButton) {
        let button = this.copyCleanObject(data)
        if (button.url) {
            button["type"] = "web_url"
            delete button.payload
        }
        else if (button.payload) {
            button["type"] = "postback"
            delete button.url
        } else return

        if (this.attachment.payload.template_type != "button")
            this.body.attachment.payload = {
                template_type: "button",
            }
        this.body.attachment.payload.buttons = this.body.attachment.payload.buttons || []
        this.body.attachment.payload.buttons.push(button)
    }

    addQuickButton(data: QuickRepliesButton) {
        this.body.quick_replies = this.body.quick_replies || []
        this.body.quick_replies.push(this.copyCleanObject(data, { content_type: "text" }))
        return this
    }

    public build(psid: string) {
        let ret = {
            recipient: {
                id: psid
            },
            messaging_type: "RESPONSE",
            message: this.body
        }
        console.log(JSON.stringify(ret))
        return ret
    }

    private copyCleanObject<T>(o: T, bonus = {}) {
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

    private get attachment() {
        if (!this.body.attachment)
            this.body.attachment = {
                type: "template",
                payload: {}
            }
        return this.body.attachment
    }
}