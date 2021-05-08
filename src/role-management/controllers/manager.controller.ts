import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    UseInterceptors,
} from "@nestjs/common";
import { TokenAuth } from "src/lib/authentication";
import { AuthorizeClass, NonAuthorize } from "src/lib/authorization";
import {
    BodyValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { CommonResponse } from "src/lib/types";
import { RoleAuthorization } from "../decorators";
import { AssignManagerDTO, ManagerDTO } from "../dtos/manager";
import { ERRORS, ManagerService } from "../modules/core";

@Controller("/managers")
@TokenAuth()
@RoleAuthorization({ attachRole: false })
@UseInterceptors(ResponseSerializerInterceptor)
@AuthorizeClass({
    entity: "manager_roleManagement",
})
export class ManagerController {
    constructor(private managerService: ManagerService) {}

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

    @Get("/:id")
    @Serialize(CommonResponse(ManagerDTO))
    async getById(@Param("id") managerId: string) {
        const result = await this.managerService.getManagerById(managerId);
        if (!result) {
            throw new NotFoundException(ERRORS.RoleNotFound);
        }
        return {
            code: 0,
            data: result.toObject(),
        };
    }
}
