import {
    IPaginator,
    PaginateOptions,
    PaginationConstruct,
    PaginationResult,
} from "./pagination.interfaces";

export default class Paginator implements IPaginator {
    protected pageOption: PaginationConstruct;

    constructor({
        pageURL,
        pageQueryParam = "page",
        pageSize = 5,
    }: PaginationConstruct) {
        this.pageOption = {
            pageURL,
            pageQueryParam,
            pageSize,
        };
    }

    async paginate<T>(
        results: T[],
        totalCount: number,
        options: PaginateOptions,
    ) {
        const { page = 1, placeholders = {}, additionQuery = {} } = options;

        const paginationInfo = this.getPaginationInfo(
            page,
            results,
            totalCount,
            placeholders,
            additionQuery,
        );

        return paginationInfo;
    }

    protected getPaginationInfo(
        page: number,
        results: any[],
        totalCount: number,
        placeholders: any,
        queries: any,
    ): PaginationResult<any> {
        const { pageSize } = this.pageOption;
        const pageCount = Math.ceil(totalCount / pageSize);
        page = page <= pageCount ? page : pageCount;
        return {
            page: page,
            next:
                page >= pageCount || pageCount === 0
                    ? null
                    : this.constructPageQuery(page + 1, placeholders, queries),
            previous:
                pageCount <= 0 || page === 1
                    ? null
                    : this.constructPageQuery(page - 1, placeholders, queries),
            total_count: totalCount,
            page_count: pageCount,
            results,
        };
    }

    protected constructPageQuery(
        page: number,
        placeholders: any,
        queries: any,
    ) {
        const { pageQueryParam, pageURL } = this.pageOption;
        let parsedURL = this.constructPathFromPlaceholders(
            pageURL,
            placeholders,
        );
        parsedURL = `${parsedURL}?${pageQueryParam}=${page}`;
        Object.keys(queries).forEach((field) => {
            parsedURL += `&${field}=${queries[field]}`;
        });
        return parsedURL;
    }

    protected constructPathFromPlaceholders(url: string, placeholders) {
        let resultURL = url;
        Object.keys(placeholders).forEach((key) => {
            if (!placeholders[key]) {
                throw Error("Dynamic route is invalid");
            }
            resultURL = resultURL.replace(`{${key}}`, placeholders[key]);
        });
        return resultURL;
    }
}
