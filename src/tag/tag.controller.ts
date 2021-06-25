import {
    Body,
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors,
    Post,
    Put,
    BadRequestException,
} from "@nestjs/common";
import {
    BodyValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { CreateTagsDTO, TagDTO, TagSearchDTO, UpdateTagDTO } from "./tag.dto";
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
            pageURL: "/tags/search",
        });
    }

    @Post("/bulk")
    async createTags(@Body(BodyValidationPipe) dto: CreateTagsDTO) {
        const result = await this.tagService.createTags(dto);
        return result;
    }

    @Get("/byid/:tagId")
    @Serialize(TagDTO)
    async findTagById(@Param("tagId") tagId: string) {
        const tag = this.tagService.getTagById(tagId);
        return tag;
    }

    @Put("/byid/:tagId")
    @Serialize(CommonResponse(TagDTO))
    async updateTag(
        @Param("tagId") tagId: string,
        @Body(BodyValidationPipe) dto: UpdateTagDTO,
    ) {
        const result = await this.tagService.updateTag(tagId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/search")
    @Serialize(TagDTO)
    async searchForTags(@Query(QueryValidationPipe) tagSearch: TagSearchDTO) {
        const start = 0;
        const limit = 100;
        console.log(tagSearch);
        const { results } = await this.tagService.searchForTags({
            ...tagSearch,
            limit,
            start,
        });
        return results;
    }

    @Get("/:type")
    @Serialize(TagDTO)
    async getAllTagsByType(@Param("type") type: string) {
        const tags = await this.tagService.getAllTagsByType(type);
        return tags;
    }
}
