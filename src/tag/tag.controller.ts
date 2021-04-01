import { Controller, Get, Query, UseInterceptors } from "@nestjs/common";
import {
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { TagDTO, TagSearchDTO } from "./tag.dto";
import { TagService } from "./tag.service";

@Controller("/tags")
@UseInterceptors(ResponseSerializerInterceptor)
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get("/search")
    @Serialize(TagDTO)
    async searchForTags(@Query(QueryValidationPipe) tagSearch: TagSearchDTO) {
        const { value, type } = tagSearch;
        const results = await this.tagService.searchForTags(value, type);
        return results;
    }
}
