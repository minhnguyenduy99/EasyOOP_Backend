import {
    BadRequestException,
    Body,
    Controller,
    Get,
    InternalServerErrorException,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { TokenAuth } from "src/lib/authentication";
import { AuthorizeClass } from "src/lib/authorization";
import {
    BodyValidationPipe,
    MongoObjectIdValidator,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { TopicDTO, TopicQueryDTO } from "src/post/dtos";
import { TopicService } from "src/post/services";

@Controller("/creator/topics")
@UseInterceptors(ResponseSerializerInterceptor)
@TokenAuth()
@AuthorizeClass({
    entity: "CreatorTopic",
})
export class CreatorTopicController {
    constructor(private topicService: TopicService) {}

    @Get("/search/available")
    @Serialize(TopicDTO)
    async getAvailableTopics(@Query(QueryValidationPipe) query: TopicQueryDTO) {
        const { search, ...limit } = query;
        const { results } = await this.topicService.searchAvailableTopics(
            search,
            limit,
        );
        return results;
    }
}
