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
    UseInterceptors,
} from "@nestjs/common";
import { TokenAuth } from "src/lib/authentication";
import { AuthorizeClass, NonAuthorize } from "src/lib/authorization";
import {
    BodyValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { RoleAuthorization } from "../decorators";
import { AssignManagerDTO, ManagerDTO } from "../dtos/manager";
import { ManagerService, SearchRolesDTO } from "../modules/core";
import { ERRORS } from "../errors";

@Controller("/managers")
@TokenAuth()
@RoleAuthorization({ attachRole: false })
@UseInterceptors(ResponseSerializerInterceptor)
@AuthorizeClass({
    entity: "manager_roleManagement",
})
export class ManagerController {
    protected paginator: IPaginator;
    protected readonly DEFAULT_SIZE_PER_PAGE = 6;

    constructor(
        private managerService: ManagerService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "/creators/search",
            pageSize: this.DEFAULT_SIZE_PER_PAGE,
        });
    }

    @Post("/assign/:user_id")
    @Serialize(CommonResponse(ManagerDTO))
    async assignManager(
        @Param("user_id") userId: string,
        @Body(BodyValidationPipe) dto: AssignManagerDTO,
    ) {
        const result = await this.managerService.assignManager(userId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return {
            code: result.code,
            data: result.data.toObject(),
        };
    }

    @Get("/search/:page")
    @Serialize(PaginationSerializer(ManagerDTO))
    async findManagers(
        @Query(QueryValidationPipe) dto: SearchRolesDTO,
        @Param("page", ParsePagePipe) page: number,
    ) {
        const { results, count } = await this.managerService.findRoles(dto, {
            groups: [],
            page,
        });
        const paginatedResults = await this.paginator.paginate(results, count, {
            page,
        });
        return paginatedResults;
    }

    @Put("/:manager_id")
    @Serialize(CommonResponse(ManagerDTO))
    async updateManager(
        @Param("manager_id") managerId: string,
        @Body() dto: any,
    ) {
        const result = await this.managerService.update(managerId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/:id")
    @Serialize(CommonResponse(ManagerDTO))
    async getById(@Param("id") managerId: string) {
        const result = await this.managerService.getManagerById(managerId);
        if (!result) {
            throw new NotFoundException(ERRORS.RoleNotFound);
        }
        return {
            code: 0,
            data: result,
        };
    }
}
