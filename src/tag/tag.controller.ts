import { Controller, Get, Param, Query, UseInterceptors } from "@nestjs/common";
import {
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { PaginatedTagDTO, TagDTO, TagSearchDTO } from "./tag.dto";
import { TagService } from "./tag.service";

@Controller("/tags")
@UseInterceptors(ResponseSerializerInterceptor)
export class TagController {
    protected paginator: IPaginator;
    protected readonly DEFAULT_COUNT_PER_PAGE = 10;
    constructor(
        private readonly tagService: TagService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "http://localhost:3000/tags/search",
        });
    }

    @Get("/search")
    @Serialize(PaginationSerializer(TagDTO))
    async searchForTags(@Query(QueryValidationPipe) tagSearch: TagSearchDTO) {
        const { page, ...search } = tagSearch;
        const start = (page - 1) * this.DEFAULT_COUNT_PER_PAGE;
        const limit = this.DEFAULT_COUNT_PER_PAGE;
        const { count, results } = await this.tagService.searchForTags({
            ...search,
            limit,
            start,
        });
        const paginatedResult = await this.paginator.paginate(results, count, {
            page,
            additionQuery: search,
        });
        return paginatedResult;
    }
}
