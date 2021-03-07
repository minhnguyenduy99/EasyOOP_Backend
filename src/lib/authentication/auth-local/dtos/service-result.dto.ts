export interface ServiceResult<Data> {
    code: number;
    data?: Data;
    error?: string | any;
}
