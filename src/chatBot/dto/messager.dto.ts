export interface ResponseMessager {
    text?: string
    quick_replies?: QuickRepliesButton[]
    buttons?: ResponseMessengerButton[]
    attachment?: MessengerAttachment[] // unique, if have attachment dont have anything else
}

export interface MessengerAttachment {
    title: string
    subtitle?: string
    image_url?: string
    buttons?: MessengerAttachmentButton[]
}

export interface MessengerAttachmentButton {
    title: string
    payload: string
}

export interface ResponseMessengerButton { // long time button choise
    title: string

    payload?: string
    url?: string
}

export interface QuickRepliesButton { // ome time button choise
    title: string
    payload: string
    image_url?: string
}

