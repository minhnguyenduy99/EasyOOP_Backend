import {
    BadRequestException,
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    NotFoundException,
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
} from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { CreateQ8ADTO, LimitOptions, Q8ADTO, UpdateQ8ADTO } from "../dtos";
import { Q8AService } from "../services/q8a.service";

@Controller("/q8a")
@UseInterceptors(ClassSerializerInterceptor)
export class Q8AController {
    protected paginator: IPaginator;
    protected readonly DEFAULT_PAGE_SIZE = 6;

    constructor(
        private q8aService: Q8AService,
        private paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = this.paginatorFactory.createPaginator({
            pageURL: "localhost:3000/q8a/search",
            pageSize: this.DEFAULT_PAGE_SIZE,
        });
    }

    @Post()
    async createQ8A(@Body(BodyValidationPipe) dto: CreateQ8ADTO) {
        const result = await this.q8aService.createQ8A(dto);
        if (result.code === -1) {
            throw new BadRequestException(result);
        }
        return {
            code: result.code,
            data: {
                qa_id: result.data._id,
            },
        };
    }

    @Put("/:qa_id")
    async updateQ8A(
        @Body(BodyValidationPipe) dto: UpdateQ8ADTO,
        @Param("qa_id", new ParamValidationPipe(MongoObjectIdValidator))
        qaId: string,
    ) {
        const result = await this.q8aService.updateQ8A(qaId, dto);
        if (result.code !== 0) {
            throw new BadRequestException(result);
        }
        return {
            code: result.code,
            data: {
                qa_id: result.data._id,
            },
        };
    }

    @Get("/:qa_id")
    async getQ8AById(
        @Param("qa_id", new ParamValidationPipe(MongoObjectIdValidator))
        id: string,
    ) {
        const result = await this.q8aService.getQ8AById(id);
        if (!result) {
            throw new NotFoundException({
                error: "Invalid Q&A ID",
            });
        }
        return new Q8ADTO(result.toObject());
    }

    @Get("/tag/:tag_id")
    async getQ8AByTag(@Param("tag_id") tagId: string) {
        const result = await this.q8aService.getQ8AByTag(tagId);
        return result;
    }

    @Get("/search/:page")
    async searchQ8A(
        @Query("q") keyword: string,
        @Param("page", ParsePagePipe) page: number,
    ) {
        const limitOptions = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        } as LimitOptions;
        const { results, count } = await this.q8aService.getListQ8As(
            keyword,
            limitOptions,
        );
        const paginatedResult = await this.paginator.paginate(results, count, {
            page,
        });
        return new (PaginationSerializer(Q8ADTO))(paginatedResult);
    }
}
