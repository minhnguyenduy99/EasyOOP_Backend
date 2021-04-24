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
import {
    BodyValidationPipe,
    MongoObjectIdValidator,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import {
    CreateTopicDTO,
    TopicDTO,
    TopicQueryDTO,
    UpdateTopicDTO,
} from "../dtos";
import { TopicService } from "../services";

@Controller("/topics")
@UseInterceptors(ResponseSerializerInterceptor)
export class TopicController {
    constructor(private topicService: TopicService) {}

    @Post()
    async createTopic(@Body(BodyValidationPipe) dto: CreateTopicDTO) {
        const result = await this.topicService.createTopic(dto);
        switch (result.code) {
            case 0:
                return {
                    code: result.code,
                    data: {
                        topic_id: result.data?._id.toString(),
                    },
                };
            case -1:
                throw new BadRequestException(result);
            default:
                throw new InternalServerErrorException(result);
        }
    }

    @Put("/:topic_id")
    async updateTopic(
        @Param("topic_id", new ParamValidationPipe(MongoObjectIdValidator))
        topicId: string,
        @Body(BodyValidationPipe) dto: UpdateTopicDTO,
    ) {
        const result = await this.topicService.updateTopic(topicId, dto);
        switch (result.code) {
            case 0:
                return {
                    code: result.code,
                    data: {
                        topic_id: result.data?._id.toString(),
                    },
                };
            case -1:
                throw new BadRequestException(result);
            default:
                throw new InternalServerErrorException(result);
        }
    }

    @Get("/search")
    @Serialize(TopicDTO)
    async getTopic(@Query(QueryValidationPipe) query: TopicQueryDTO) {
        const { search, ...limit } = query;
        const { results } = await this.topicService.searchTopic(search, limit);
        return results;
    }
}
