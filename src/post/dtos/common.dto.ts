export interface LimitOptions {
    start?: number;
    limit?: number;
}

export interface SortOptions {
    field: string;
    asc?: boolean;
}

export interface PaginatedResult {
    count?: number;
    results: any[];
}
