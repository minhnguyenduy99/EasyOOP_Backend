export interface ServiceResult<T> {
    code: number;
    error?: any;
    data?: T;
}

export interface RoleSearchOptions {
    alias?: string;
}

export interface QueryOptions {
    groups?: string[];
    page?: number;
}
