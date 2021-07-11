import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseBoolPipe,
    Patch,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthUserDecorator, TokenAuth } from "src/lib/authentication";
import { AuthorizeClass } from "src/lib/authorization";
import {
    BodyValidationPipe,
    ParamValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import {
    IPaginator,
    IResultLimiter,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { PaginatedVerificationDTO } from "src/post/dtos";
import { POST_ERRORS } from "src/post/helpers";
import {
    PostVerificationDTO,
    PostVerificationService,
    SearchVerificationDTO,
} from "src/post/modules/post-verification";
import { RoleAuthorizationGuard, RoleUserData } from "src/role-management";
import { BatchDeleteVerificationDTO, UpdateVerificationDTO } from "./dtos";

@Controller("/creator/verifications")
@UseGuards(RoleAuthorizationGuard)
@TokenAuth()
@UseInterceptors(ResponseSerializerInterceptor)
@AuthorizeClass({
    entity: "CreatorVerification",
})
export class CreatorVerificationController {
    protected readonly DEFAULT_PAGE_SIZE = 6;
    protected verificationLimiter: IResultLimiter;
    protected paginator: IPaginator;

    constructor(
        private postVerification: PostVerificationService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.paginator = paginatorFactory.createPaginator({
            pageURL: "/search/{page}",
            pageSize: this.DEFAULT_PAGE_SIZE,
            pageParamType: "param",
        });
    }

    @Delete("/cancel/:id")
    @Serialize(CommonResponse(PostVerificationDTO))
    async cancelVerification(@Param("id") verificationId: string) {
        const result = await this.postVerification.cancel(verificationId);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Patch()
    async batchDelete(
        @Body(BodyValidationPipe) request: BatchDeleteVerificationDTO,
        @AuthUserDecorator() creator: RoleUserData,
    ) {
        const result = await this.postVerification.batchDelete(
            request.data.map((verification) => verification.verification_id),
            creator.role_id,
        );
        if (result["error"]) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/latest")
    @Serialize(PostVerificationDTO)
    async getLatestVerifications(@AuthUserDecorator() creator: RoleUserData) {
        const verifications = await this.postVerification.getLatestVerifications(
            4,
            { authorId: creator.role_id },
        );
        return verifications;
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

    @Put("/:id")
    @Serialize(CommonResponse(PostVerificationDTO))
    async update(
        @Param("id") verificationId: string,
        @Body(BodyValidationPipe) dto: UpdateVerificationDTO,
    ) {
        const result = await this.postVerification.updateVerification(
            verificationId,
            dto,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return {
            code: result.code,
            data: {
                verification_id: result.data.verification_id,
            },
        };
    }

    @Get("/search/:page")
    @Serialize(PaginatedVerificationDTO)
    async getVerificationsGroupedByPost(
        @Param("page", ParsePagePipe) page: number,
        @Query(QueryValidationPipe) query: SearchVerificationDTO,
        @AuthUserDecorator() creator: RoleUserData,
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
                authorId: creator.role_id,
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
    async getVerificationById(
        @Param("id") verificationId: string,
        @AuthUserDecorator() creator: RoleUserData,
    ) {
        const verification = await this.postVerification.getVerficationById(
            verificationId,
            {
                authorId: creator.role_id,
            },
        );
        if (!verification) {
            throw new NotFoundException();
        }
        return verification;
    }
}
