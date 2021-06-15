import { TaskID } from "./service/task";

export interface ResponseMessengerDTO { }

export interface SimpleTextDTO extends ResponseMessengerDTO {
    text: string | string[]
}

export interface QuickRepliesMessengerDTO extends SimpleTextDTO { // ome time button choise
    buttons: QuickRepliesButton[]
}

export interface AttachmentElement extends ResponseMessengerDTO {
    title?: string
    subtitle?: string | string[]
    image_url?: string
    buttons?: MessengerButton[] // max length = 3
    default_action?: {
        url: string
        webview_height_ratio?: "COMPACT" | "TALL" | "FULL"
    }
}

export interface MediaElement extends ResponseMessengerDTO {
    media_type: "image" | "video"
    url: string
    buttons?: MessengerButton[]
}

//#region hidden
interface PayloadTask {
    tid: TaskID,
    args: any[]
}

interface QuickRepliesButton {
    title: string
    payload: string | PayloadTask | object
    image_url?: string
}

interface MessengerButton {
    title: string

    url?: string

    payload?: string | object
    image_url?: string
}

interface Attachment {
    type: string
    elements: AttachmentElement[]
}
//#endregion