import { Inject, Injectable, Optional } from "@nestjs/common";
import Paginator from "./paginator/paginator";
import {
    IPaginator,
    PaginationConstruct,
} from "./paginator/pagination.interfaces";
import ResultLimiter from "./limiter/result-limiter";
import {
    IResultLimiter,
    ResultLimiterConstruct,
} from "./limiter/result-limiter.interfaces";
import { PAGINATION_CONFIG_PROVIDER } from "./consts";
import { PaginationConfig } from "./interfaces";

@Injectable()
export default class PaginatorFactory {
    @Inject(PAGINATION_CONFIG_PROVIDER)
    @Optional()
    protected config: PaginationConfig;

    createPaginator(options: PaginationConstruct): IPaginator {
        const mergeOptions = this.getMergedPaginatorConfig(options);
        return new Paginator(mergeOptions);
    }

    createLimiter(options: ResultLimiterConstruct): IResultLimiter {
        return new ResultLimiter(options);
    }

    protected getMergedPaginatorConfig(options: PaginationConstruct) {
        if (!this.config) {
            return options;
        }
        const url = options.pageURL;
        const containDomainIndex = url.search(/(http(s)*:\/\/)*\w+(:[0-9]+)*/);
        if (containDomainIndex === 0) {
            return options;
        }
        const newURL = this.config.baseURL + options.pageURL;
        return {
            ...options,
            pageURL: newURL,
        } as PaginationConstruct;
    }
}
