export interface TestQueryOptions {
    start?: number;
    limit?: number;
    groupWithSentences?: boolean;
    totalScore?: boolean;
    verifying_status?: number;
}

export interface SentenceQueryOptions {
    verifying_status?: number;
    start?: number;
    limit?: number;
}

export interface TestFilter {
    title?: string;
    creator_id?: string;
    topic_id?: string;
    verifying_status?: number;
    type?: number;
}

export interface TestResultQueryOptions {
    start?: number;
    limit?: number;
    sort_by?: string;
    sort_order?: number;
}

export interface DetailedTestResultQueryOptions {
    start?: number;
    limit?: number;
}
