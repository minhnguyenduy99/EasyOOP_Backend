export interface QueryActionResult<Data> {
    error?: string;
    data?: Data;
}

export interface CommitActionResult<Data> {
    code: number;
    error?: string;
    data?: Data;
}
