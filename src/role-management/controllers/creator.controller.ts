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
import { IsPublic, TokenAuth } from "src/lib/authentication/core";
import { AuthorizeClass, NonAuthorize } from "src/lib/authorization";
import {
    BodyValidationPipe,
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
import { CommonResponse } from "src/lib/types";
import { RoleAuthorization, RoleUser } from "../decorators";
import { RoleUserData } from "../dtos";
import { CreateCreatorDTO, CreatorDTO } from "../dtos/creator";
import { CreatorService, ROLES, SearchRolesDTO } from "../modules/core";
import { ERRORS } from "../errors";

@Controller("creators")
@UseInterceptors(ResponseSerializerInterceptor)
@RoleAuthorization()
@TokenAuth()
@AuthorizeClass({
    entity: "creator_roleManagement",
})
export class CreatorController {
    protected paginator: IPaginator;

    constructor(
        private creatorService: CreatorService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "http://localhost:3000/creators/search",
            pageSize: 6,
        });
    }

    @Post("/assign/:user_id")
    @Serialize(CommonResponse(CreatorDTO))
    async assignCreator(
        @Param("user_id") userId: string,
        @RoleUser() manager: RoleUserData,
        @Body(BodyValidationPipe) dto: CreateCreatorDTO,
    ) {
        const result = await this.creatorService.createCreator(userId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return {
            code: result.code,
            data: result.data.toObject(),
        };
    }

    @Get("/search/:page")
    @Serialize(PaginationSerializer(CreatorDTO))
    async findCreators(
        @Query(QueryValidationPipe) dto: SearchRolesDTO,
        @Param("page", ParsePagePipe) page: number,
    ) {
        const { results, count } = await this.creatorService.findRoles(dto, {
            groups: [],
            page,
        });
        const paginatedResults = await this.paginator.paginate(results, count, {
            page,
        });
        return paginatedResults;
    }

    @Put("/:creator_id")
    @Serialize(CommonResponse(CreatorDTO))
    async updateCreator(
        @Param("creator_id") creatorId: string,
        @Body() dto: any,
    ) {
        const result = await this.creatorService.update(creatorId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/:id")
    @Serialize(CommonResponse(CreatorDTO))
    async getById(@Param("id") creatorId: string) {
        const result = await this.creatorService.getCreatorById(creatorId);
        if (!result) {
            throw new NotFoundException(ERRORS.RoleNotFound);
        }
        return {
            code: 0,
            data: result,
        };
    }
}
