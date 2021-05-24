export interface TestQueryOptions {
    start?: number;
    limit?: number;
    groupWithSentences?: boolean;
    totalScore?: boolean;
    verify_status?: number;
}

export interface SentenceQueryOptions {
    start?: number;
    limit?: number;
}

export interface TestFilter {
    title?: string;
    creator_id?: string;
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
