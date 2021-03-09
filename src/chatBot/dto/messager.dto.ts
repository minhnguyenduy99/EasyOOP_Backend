export interface ResponseMessager {
    text?: string
    buttons?: ResponseMessagerButton[]
    title?: string
    subtitle?: string
    image_url?: string
}

export interface ResponseMessagerButton {
    title: string
    payload: string
}