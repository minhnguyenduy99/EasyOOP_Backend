export interface GroupOptions {
    type: string;
    options?: any;
}

export interface PostGroupOptions {
    metadata?: boolean;
    topic?: boolean;
    removeFields?: string[];
    postStatus?: number;
    tag?: boolean;
}
