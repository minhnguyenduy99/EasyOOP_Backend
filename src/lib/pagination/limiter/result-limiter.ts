import {
    IResultLimiter,
    LimitOptions,
    ResultLimiterConstruct,
    ResultLimiterOuptput,
} from "./result-limiter.interfaces";

export default class ResultLimiter implements IResultLimiter {
    protected limitOptions: ResultLimiterConstruct;
    protected readonly DEFAULT_LIMIT_VALUE = 6;

    constructor(options: ResultLimiterConstruct) {
        const {
            requestURL,
            limitQueryParam = "start",
            limit = this.DEFAULT_LIMIT_VALUE,
        } = options;
        this.limitOptions = {
            requestURL,
            limitQueryParam,
            limit,
        };
    }

    async limit<T>(
        results: T[],
        totalCount: number,
        options: LimitOptions,
    ): Promise<ResultLimiterOuptput<T>> {
        const { start = 0, placeholders = {}, additionQuery = null } = options;
        const { limit } = this.limitOptions;
        const nextOffset = start + limit;

        let next = null,
            remainItemCount = totalCount - nextOffset;

        if (remainItemCount > 0) {
            next = this.constructNextQueryURL(
                placeholders,
                nextOffset,
                additionQuery,
            );
        }

        return {
            next,
            total_count: totalCount,
            remain_item_count: remainItemCount > 0 ? remainItemCount : 0,
            results: results,
        };
    }

    protected constructNextQueryURL(
        placeholders,
        start = 0,
        query = null,
    ): string {
        let { requestURL } = this.limitOptions;
        let parsedQueryURL = requestURL;
        const { limitQueryParam } = this.limitOptions;
        Object.keys(placeholders).forEach((key) => {
            if (!placeholders[key]) {
                throw Error("Dynamic route is invalid");
            }
            parsedQueryURL = parsedQueryURL.replace(
                `{${key}}`,
                placeholders[key],
            );
        });
        parsedQueryURL += `?${limitQueryParam}=${start}`;
        if (query) {
            parsedQueryURL = this.constructAdditionalQueryParameters(
                parsedQueryURL,
                query,
            );
        }
        return parsedQueryURL;
    }

    protected constructAdditionalQueryParameters(
        currentURL: string,
        queryObj: any,
    ) {
        let resultURL = currentURL;
        Object.keys(queryObj).forEach((queryName) => {
            resultURL += `&${queryName}=${queryObj[queryName]}`;
        });
        return resultURL;
    }
}
