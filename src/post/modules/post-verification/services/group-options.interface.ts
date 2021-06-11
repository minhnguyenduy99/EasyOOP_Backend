export interface GroupOptions {
    type: string;
    options?: any;
}

export interface PostGroupOptions {
    metadata?: boolean;
    topic?: boolean;
    removeFields?: string[];
    verificationStatus?: number;
    tag?: boolean;
}
