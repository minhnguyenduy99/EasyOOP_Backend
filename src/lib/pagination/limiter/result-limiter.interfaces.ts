export interface IResultLimiter {
    /**
     * Apply limit to the queried results
     * @param options Options for the limit query
     */
    limit<T>(
        results: T[],
        totalCount: number,
        options: LimitOptions,
    ): Promise<ResultLimiterOuptput<T>> | ResultLimiterOuptput<T>;
}

export interface LimitOptions {
    start?: number;

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
        [key: string]: string;
    };

    additionQuery?: {
        [key: string]: any;
    };
}

export interface ResultLimiterConstruct {
    /**
     * The URL used for limiter
     */
    requestURL: string;

    /**
     * The query param used in the url. Default is `page`
     *
     * Example: If the `limitQueryParam` is `page`, the `url` result will be:
     *
     * `<url>?page=<page_value>`
     */
    limitQueryParam?: string;
    limit?: number;
}

export interface ResultLimiterOuptput<T> {
    /**
     * The url used for the next results.
     */
    next: string;

    /**
     * The total item count
     */
    total_count: number;

    /**
     * The number of results remain.
     */
    remain_item_count: number;

    /**
     * Array of results
     */
    results: T[];
}
