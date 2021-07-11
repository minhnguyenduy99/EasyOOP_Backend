import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Param,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthUserDecorator, TokenAuth } from "src/lib/authentication";
import { AuthorizeClass } from "src/lib/authorization";
import {
    ParamValidationPipe,
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
import { POST_ERRORS } from "src/post/helpers";
import { PostVerificationService } from "src/post/modules/post-verification";
import {
    PostVerificationDTO,
    SearchVerificationDTO,
} from "src/post/modules/post-verification/dtos";
import { RoleAuthorizationGuard, RoleUserData } from "src/role-management";
import { PaginatedVerificationDTO } from "./dtos";

@Controller("/manage/verifications")
@UseInterceptors(ResponseSerializerInterceptor)
@UseGuards(RoleAuthorizationGuard)
@TokenAuth()
@AuthorizeClass({
    entity: "ManagerPostVerification",
})
export class PostVerificationController {
    protected readonly DEFAULT_PAGE_SIZE = 6;
    protected paginator: IPaginator;

    constructor(
        private postVerification: PostVerificationService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "/manage",
            pageSize: this.DEFAULT_PAGE_SIZE,
            pageParamType: "param",
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

    @Get("/posts/:post_id")
    @Serialize(PostVerificationDTO)
    async getHistoryOfPost(
        @Param("post_id", ParamValidationPipe)
        postId: string,
    ) {
        const verifications = await this.postVerification.getVerificationByPost(
            postId,
        );
        if (verifications.length === 0) {
            throw new NotFoundException(POST_ERRORS.PostNotFound);
        }
        return verifications;
    }

    @Get("/search/:page")
    @Serialize(PaginatedVerificationDTO)
    async getVerificationsGroupedByPost(
        @Param("page", ParsePagePipe) page: number,
        @Query(QueryValidationPipe) query: SearchVerificationDTO,
    ) {
        const limitOptions = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        const {
            count,
            results,
        } = await this.postVerification.findVerificationGroupedByPost(
            query,
            {
                authorId: query.creatorId,
            },
            limitOptions,
        );

        const paginatedResult = (await this.paginator.paginate(results, count, {
            page,
            additionQuery: query,
        })) as PaginatedVerificationDTO;
        return paginatedResult;
    }

    @Get("/:id")
    @Serialize(PostVerificationDTO)
    async getDetailedVerification(@Param("id") verificationId: string) {
        const result = await this.postVerification.getVerficationById(
            verificationId,
        );
        return result;
    }
}
