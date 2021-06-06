import {
    BadRequestException,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Put,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { AuthUserDecorator, TokenAuth } from "src/lib/authentication";
import { AuthorizeClass } from "src/lib/authorization";
import {
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { PostVerificationService } from "src/post/modules/post-verification";
import { VERIFICATION_STATUS } from "src/post/modules/post-verification/consts";
import {
    PostVerificationDTO,
    SearchVerificationDTO,
} from "src/post/modules/post-verification/dtos";
import { RoleUserData } from "src/role-management";
import { PaginatedVerificationDTO } from "./dtos";

@Controller("/manage/verifications")
@UseInterceptors(ResponseSerializerInterceptor)
@TokenAuth()
@AuthorizeClass({
    entity: "ManagerPostVerification",
})
export class PostVerificationController {
    protected readonly DEFAULT_PAGE_SIZE = 10;
    protected paginator: IPaginator;

    constructor(
        private postVerification: PostVerificationService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "http://localhost:3000/manage",
            pageSize: this.DEFAULT_PAGE_SIZE,
        });
    }

    @Put("/:id/verify")
    @Serialize(CommonResponse(PostVerificationDTO))
    async verify(
        @Param("id") verificationId: string,
        @AuthUserDecorator() manager: RoleUserData,
    ) {
        let result = await this.postVerification.verify(verificationId, {
            manager_id: manager.role_id,
        });
        if (result.code !== 0) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Put("/:id/unverify")
    @Serialize(CommonResponse())
    async unverify(
        @Param("id") verificationId: string,
        @AuthUserDecorator() manager: RoleUserData,
    ) {
        let result = await this.postVerification.unverify(verificationId, {
            manager_id: manager.role_id,
        });
        if (result.code !== 0) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/summary")
    async getSummaryGroupByManager(@AuthUserDecorator() manager: RoleUserData) {
        const result = await this.postVerification.getSumVerificationGroupByManager(
            manager.role_id,
        );
        return result;
    }

    @Get("/:id")
    @Serialize(PostVerificationDTO)
    async getDetailedVerification(@Param("id") verificationId: string) {
        const result = await this.postVerification.getVerficationById(
            verificationId,
        );
        return result;
    }

    @Get("/pending/search/:page")
    @Serialize(PaginatedVerificationDTO)
    async findPendingVerifications(
        @Param("page", ParsePagePipe) page: number,
        @Query(QueryValidationPipe) search: SearchVerificationDTO,
        @Query("group", ParseBoolPipe) group = false,
        @AuthUserDecorator() manager: RoleUserData,
    ) {
        search = {
            ...search,
            status: VERIFICATION_STATUS.PENDING,
            limit: (page - 1) * this.DEFAULT_PAGE_SIZE,
        };
        const [{ count, results }, groupResult] = await Promise.all([
            this.postVerification.findVerifications(search),
            group
                ? this.postVerification.getSumVerificationGroupByManager(
                      manager.role_id,
                  )
                : Promise.resolve(true),
        ]);
        const paginatedResult = (await this.paginator.paginate(results, count, {
            page,
        })) as PaginatedVerificationDTO;
        if (!group) {
            return paginatedResult;
        }
        paginatedResult.groups = groupResult;
        return paginatedResult;
    }

    @Get("/search/:page")
    @Serialize(PaginatedVerificationDTO)
    async findVerifications(
        @Param("page", ParsePagePipe) page: number,
        @Query(QueryValidationPipe) search: SearchVerificationDTO,
        @Query("group", ParseBoolPipe) group = false,
        @AuthUserDecorator() manager: RoleUserData,
    ) {
        search = {
            ...search,
            limit: (page - 1) * this.DEFAULT_PAGE_SIZE,
        };
        const [{ count, results }, groupResult] = await Promise.all([
            this.postVerification.findVerifications(search, {
                managerId: manager.role_id,
            }),
            group
                ? this.postVerification.getSumVerificationGroupByManager(
                      manager.role_id,
                  )
                : Promise.resolve(true),
        ]);
        const paginatedResult = (await this.paginator.paginate(results, count, {
            page,
        })) as PaginatedVerificationDTO;
        if (!group) {
            return paginatedResult;
        }
        paginatedResult.groups = groupResult;
        return paginatedResult;
    }
}
