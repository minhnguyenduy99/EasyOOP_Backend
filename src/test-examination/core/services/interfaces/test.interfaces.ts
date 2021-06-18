export interface TestQueryOptions {
    start?: number;
    limit?: number;
}

export interface TestFilter {
    title?: string;
    creator_id?: string;
    topic_id?: string;
    available_status?: number;
    type?: number;
}
