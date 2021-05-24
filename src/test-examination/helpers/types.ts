export interface ServiceResult<Data> {
    code: number;
    error?: string;
    data?: Data;
}
