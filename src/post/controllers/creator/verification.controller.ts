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
import { IResultLimiter, PaginatorFactory } from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { MockAuthor, MockManager } from "src/post/decorators/mock.decorator";
import { POST_STATUSES } from "src/post/modules/core";
import {
    LimitedPostVerificationDTO,
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

    constructor(
        private postVerification: PostVerificationService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.verificationLimiter = paginatorFactory.createLimiter({
            requestURL: "localhost:3000/creator/verifications/pending/search",
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

    @Get("/search")
    @Serialize(LimitedPostVerificationDTO)
    async getPendingVerifications(
        @Query(QueryValidationPipe) query: SearchVerificationDTO,
        @Query("group", ParseBoolPipe) group = false,
        @AuthUserDecorator() creator: RoleUserData,
    ) {
        const status = query.status;
        let postStatus = null;
        if (status === VERIFICATION_STATUS.VERIFIED) {
            postStatus = POST_STATUSES.ACTIVE;
        }
        const [{ count, results }, groupResult] = await Promise.all([
            this.postVerification.findVerifications(query, {
                authorId: creator.role_id,
                groups: [
                    {
                        type: "post",
                        options: {
                            metadata: true,
                            topic: true,
                            tag: true,
                            postStatus,
                        },
                    },
                    {
                        type: "manager",
                    },
                ],
            }),
            group
                ? this.postVerification.getSumVerificationGroupByCreator(
                      creator.role_id,
                  )
                : Promise.resolve(true),
        ]);
        const limiter = (await this.verificationLimiter.limit(results, count, {
            start: query.limit,
        })) as LimitedPostVerificationDTO;
        if (!group) {
            return limiter;
        }
        limiter.groups = groupResult;
        return limiter;
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
