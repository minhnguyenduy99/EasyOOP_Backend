import { Controller, Get, Query } from "@nestjs/common";
import { QueryValidationPipe } from "src/lib/helpers";
import { TagSearchDTO } from "./tag.dto";
import { TagService } from "./tag.service";

@Controller("/tags")
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Get("/search")
    async searchForTags(@Query(QueryValidationPipe) tagSearch: TagSearchDTO) {
        const { value, type } = tagSearch;
        const results = await this.tagService.searchForTags(value, type);
        return results;
    }
}
