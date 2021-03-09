import { ResponseMessager } from "../dto"

export class MessengerBuilder {
    private body: any
    private message: string

    public constructor() {
        this.body = {}
    }

    public set(data: ResponseMessager) {
        data.text && this.setMessage(data.text)
        data.buttons?.forEach(e => this.addButton(e.title, e.payload))
        data.title && this.setTitleAttachment(data.title)
        data.subtitle && this.setSubtitleAttachment(data.subtitle)
        data.image_url && this.setImageAttachment(data.image_url)
        return this
    }

    public add(data: ResponseMessager) {
        this.putNext()
        this.set(data)
    }

    public setMessage(content: string) {
        this.body.text = content
        return this
    }

    public setImageAttachment(url: string) {
        this.attachment.image_url = url
        return this
    }

    setTitleAttachment(title: string) {
        this.attachment.title = title
        return this
    }

    setSubtitleAttachment(subtitle: string) {
        this.attachment.subtitle = subtitle
        return this
    }

    addButton(title: string, payload: string) {
        let buttons = this.attachment.buttons = this.attachment.buttons || [];
        buttons.push({
            type: "postback",
            title: title,
            payload: payload
        })
    }

    public build(psid: string) {
        let ret = {
            recipient: {
                id: psid
            },
            message: this.body
        }
        console.log(JSON.stringify(ret))
        return ret
    }

    private get attachment() {
        return this.elements[this.elements.length - 1]
    }

    private get elements() {
        if (!this.body.attachment) {
            this.body.attachment = {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{}]
                }
            }
        }
        return this.body.attachment.payload.elements
    }

    private putNext() {
        this.elements[this.elements.length] = {}
    }
}