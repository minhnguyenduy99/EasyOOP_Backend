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
    UseInterceptors,
} from "@nestjs/common";
import { AuthUserDecorator, TokenAuth } from "src/lib/authentication";
import {
    BodyValidationPipe,
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
import {
    PostVerificationDTO,
    PostVerificationService,
    SearchVerificationDTO,
} from "src/post/modules/post-verification";
import { VERIFICATION_STATUS } from "src/post/modules/post-verification/consts";
import { RoleUserData } from "src/role-management";
import { BatchDeleteVerificationDTO, UpdateVerificationDTO } from "./dtos";

@Controller("/creator/verifications")
@TokenAuth()
@UseInterceptors(ResponseSerializerInterceptor)
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

    @Get("/summary")
    async getVerificationGroupInfo(@AuthUserDecorator() creator: RoleUserData) {
        const result = await this.postVerification.getSumVerificationGroupByCreator(
            creator.role_id,
        );
        return result;
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
    async getPendingVerifications(
        @Param("page", ParsePagePipe) page: number,
        @Query(QueryValidationPipe) query: SearchVerificationDTO,
        @Query("group", ParseBoolPipe) group = false,
        @AuthUserDecorator() creator: RoleUserData,
    ) {
        const status = query.status;
        const limitOptions = {
            start: (page - 1) * this.DEFAULT_PAGE_SIZE,
            limit: this.DEFAULT_PAGE_SIZE,
        };
        let active = status === VERIFICATION_STATUS.PENDING ? false : true;
        const [{ count, results }, groupResult] = await Promise.all([
            this.postVerification.findVerifications(
                query,
                {
                    authorId: creator.role_id,
                    groups: [
                        {
                            type: "post",
                            options: {
                                metadata: true,
                                topic: true,
                                tag: true,
                                active,
                                verificationStatus: status,
                            },
                        },
                        {
                            type: "manager",
                        },
                    ],
                },
                limitOptions,
            ),
            group
                ? this.postVerification.getSumVerificationGroupByCreator(
                      creator.role_id,
                  )
                : Promise.resolve(true),
        ]);
        const paginatedResult = (await this.paginator.paginate(results, count, {
            page,
            additionQuery: query,
        })) as PaginatedVerificationDTO;
        if (!group) {
            return paginatedResult;
        }
        paginatedResult.groups = groupResult;
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
