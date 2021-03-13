export interface ResponseMessengerDTO { }

export interface SimpleTextDTO extends ResponseMessengerDTO {
    text: string
}

export interface QuickRepliesMessengerDTO extends SimpleTextDTO { // ome time button choise
    buttons: QuickRepliesButton[]
}

export interface AttachmentElement {
    title?: string
    subtitle?: string
    image_url?: string
    buttons?: MessengerButton[] // max length = 3
    default_action?: {
        url: string
        webview_height_ratio?: "COMPACT" | "TALL" | "FULL"
    }
}

//#region hidden

interface QuickRepliesButton {
    title: string
    payload: string
    image_url?: string
}

interface MessengerButton {
    title: string

    url?: string

    payload?: string
    image_url?: string
}

interface Attachment {
    type: string
    elements: AttachmentElement[]
}
//#endregion