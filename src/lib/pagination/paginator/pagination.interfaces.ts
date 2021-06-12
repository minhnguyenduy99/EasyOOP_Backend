export interface IPaginator {
    /**
     * Paginate the results queried from model
     * @param model The model to be applied with pagination
     * @param options Options for pagination result
     */
    paginate<T>(
        results: T[],
        totalCount: number,
        options: PaginateOptions,
    ): Promise<PaginationResult<T | any>> | PaginationResult<T | any>;
}

export interface PaginateOptions {
    /**
     * The page value to retrieve result. Default to `1`
     */
    page?: number;

    /**
     * An object of placeholder in the `url` of pagination if the url contains params
     *
     * `Example`:
     *
     * url = `http://localhost:3000/:user_id/profiles`
     *
     * You need to pass `user123` value to to `user_id`
     *
     * The `user_id` param is dynamic so we can use the `placeholders` as below:
     *
     * placeholders: {
     *
     * `"user_id"`: "user123"
     *
     * }
     */
    placeholders?: {
        [key: string]: any;
    };

    additionQuery?: {
        [key: string]: any;
    };
}

export interface PaginationConstruct {
    pageURL: string;
    pageSize?: number;
    pageQueryParam?: string;
    pageParamType?: "param" | "query";
}

export interface PaginationResult<T> {
    page: number;
    next: string;
    previous: string;
    total_count: number;
    page_count: number;
    results: T[];
}
