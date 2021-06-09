import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { TokenAuth } from "src/lib/authentication";
import { AuthorizeClass, NonAuthorize } from "src/lib/authorization";
import { AuthorizationGuard } from "src/lib/authorization/guards/authorization-guard";
import {
    BodyValidationPipe,
    MongoObjectIdValidator,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import { IPaginator, PaginatorFactory } from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { RoleAuthorizationGuard } from "src/role-management";
import {
    CreateQ8ADTO,
    Q8ADTO,
    SearchQ8ADTO,
    UnusedQuestionTags,
    UpdateQ8ADTO,
} from "../dtos";
import { Q8AService } from "../services/q8a.service";
import ERRORS from "../errors";

@Controller("/q8a")
@UseGuards(RoleAuthorizationGuard)
@AuthorizeClass({
    entity: "qanda",
})
@UseInterceptors(ResponseSerializerInterceptor)
export class Q8AController {
    protected paginator: IPaginator;
    protected readonly DEFAULT_PAGE_SIZE = 6;

    constructor(
        private q8aService: Q8AService,
        private paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = this.paginatorFactory.createPaginator({
            pageURL: "/q8a/search",
            pageSize: this.DEFAULT_PAGE_SIZE,
        });
    }

    @Get("/search")
    @Serialize(PaginationSerializer(Q8ADTO), true)
    @NonAuthorize()
    async searchQ8A(@Query(QueryValidationPipe) searchDTO: SearchQ8ADTO) {
        const { page, ...search } = searchDTO;
        const limitOptions = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        const { results, count } = await this.q8aService.getListQ8As({
            ...search,
            ...limitOptions,
        });
        const paginatedResult = await this.paginator.paginate(results, count, {
            page,
            additionQuery: search,
        });
        return paginatedResult;
    }

    @Get("/unused-tags")
    @TokenAuth()
    @Serialize(UnusedQuestionTags)
    async getUnusedQuestionTags(@Query("search") search: string) {
        const result = await this.q8aService.getUnusedQuestionTags(search);
        return new UnusedQuestionTags(result);
    }

    @Post()
    @TokenAuth()
    @Serialize(CommonResponse(Q8ADTO))
    async createQ8A(@Body(BodyValidationPipe) dto: CreateQ8ADTO) {
        const result = await this.q8aService.createQ8A(dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Put("/:qa_id")
    @TokenAuth()
    async updateQ8A(
        @Body(BodyValidationPipe) dto: UpdateQ8ADTO,
        @Param("qa_id") qaId: string,
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
    @TokenAuth()
    @Serialize(Q8ADTO)
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
        return result;
    }

    @Get("/tag/:tag_id")
    @TokenAuth()
    @Serialize(Q8ADTO)
    async getQ8AByTag(@Param("tag_id") tagId: string) {
        const result = await this.q8aService.getQ8AByTag(tagId);
        if (!result) {
            throw new NotFoundException(ERRORS.InvalidTag);
        }
        return result;
    }
}
