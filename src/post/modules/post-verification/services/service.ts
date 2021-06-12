import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model } from "mongoose";
import { AggregateBuilder } from "src/lib/database/mongo";
import { LimitOptions } from "src/post/dtos";
import { POST_ERRORS } from "src/post/helpers";
import { CommitActionResult, ERRORS, PostMetadata } from "../../core";
import { VERIFICATION_STATUS, VERIFICATION_TYPES } from "../consts";
import {
    CreateVerificationDTO,
    SearchVerificationDTO,
} from "../dtos/actions.dto";
import { POST_VERIFICAITON_EVENTS } from "../events/consts";
import { PostVerification } from "../models";
import { QueryOptions } from "./query-options.interface";
import { VerificationHelper } from "./verification.helper";
import { VerifyOptions } from "./verify-options.interface";

export interface IPostVerificationService {
    createVerification(
        dto: CreateVerificationDTO,
    ): Promise<CommitActionResult<PostVerification>>;
    getVerficationById(
        id: string,
        queryOptions?: QueryOptions,
    ): Promise<PostVerification>;
    findVerifications(
        input: SearchVerificationDTO,
        queryOptions?: QueryOptions,
        limitOptions?: LimitOptions,
    ): Promise<any>;
    verify(
        id: string,
        verifyOptions: VerifyOptions,
    ): Promise<CommitActionResult<string>>;
    unverify(
        id: string,
        verifyOptions: VerifyOptions,
    ): Promise<CommitActionResult<string>>;
    updateVerification(
        id: string,
        data: any,
    ): Promise<CommitActionResult<PostVerification>>;
    cancel(
        id: string,
    ): Promise<CommitActionResult<{ verification_id: string }>>;
    getSumVerificationByGroup(): Promise<any>;
}

@Injectable()
export class PostVerificationService implements IPostVerificationService {
    constructor(
        @InjectModel(PostVerification.name)
        private verificationModel: Model<PostVerification>,
        private verificationHelper: VerificationHelper,
        private logger: Logger,
        private eventEmitter: EventEmitter2,
    ) {}

    async getSumVerificationGroupByManager(managerId: string) {
        const builder = new AggregateBuilder();
        builder.match({
            $or: [
                {
                    status: VERIFICATION_STATUS.PENDING,
                },
                {
                    manager_id: managerId,
                },
            ],
        });
        this.verificationHelper.groupByPostStatus(builder);

        const result = await this.verificationModel.aggregate(builder.build());
        return result.reduce(
            (previous, cur) => ({
                ...previous,
                [cur.status]: { count: cur.count },
            }),
            {},
        );
    }

    async getSumVerificationGroupByCreator(creatorId: string) {
        const builder = new AggregateBuilder();
        builder.match({
            author_id: creatorId,
        });
        this.verificationHelper.groupByPostStatus(builder);
        const result = await this.verificationModel.aggregate(builder.build());
        return result.reduce(
            (previous, cur) => ({
                ...previous,
                [cur.status]: { count: cur.count },
            }),
            {},
        );
    }

    async getSumVerificationByGroup(): Promise<any> {
        const builder = new AggregateBuilder();
        builder.aggregate([
            {
                $group: {
                    _id: {
                        status: "$status",
                    },
                    count: {
                        $sum: 1,
                    },
                },
            },
            {
                $sort: {
                    status: 1,
                },
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id.status",
                    count: 1,
                },
            },
        ]);
        const result = await this.verificationModel.aggregate(builder.build());
        return result.reduce(
            (previous, cur) => ({
                ...previous,
                [cur.status]: { count: cur.count },
            }),
            {},
        );
    }

    async cancel(
        id: string,
    ): Promise<CommitActionResult<{ verification_id: string }>> {
        try {
            const verification = await this.verificationModel.findOneAndDelete({
                verification_id: id,
                status: VERIFICATION_STATUS.PENDING,
            });
            if (!verification) {
                return POST_ERRORS.VerificationNotFound;
            }
            this.eventEmitter.emitAsync(
                POST_VERIFICAITON_EVENTS.VERIFICATION_CANCEL,
                {
                    verification,
                },
            );
            return {
                code: 0,
                data: {
                    verification_id: verification.verification_id,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }

    async updateVerification(
        id: string,
        data: any,
    ): Promise<CommitActionResult<PostVerification>> {
        const { custom_info } = data;
        try {
            const result = await this.verificationModel.findOneAndUpdate(
                {
                    verification_id: id,
                    status: VERIFICATION_STATUS.PENDING,
                },
                {
                    custom_info,
                },
                {
                    new: true,
                    useFindAndModify: false,
                },
            );
            if (!result) {
                return POST_ERRORS.VerificationNotFound;
            }
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            return POST_ERRORS.ServiceError;
        }
    }

    async unverify(
        id: string,
        verifyOptions: VerifyOptions,
    ): Promise<CommitActionResult<string>> {
        const verification = await this.verificationModel.findOne({
            verification_id: id,
        });
        if (!verification) {
            return POST_ERRORS.VerificationNotFound;
        }
        let event: string = null;
        switch (verification.type) {
            case VERIFICATION_TYPES.CREATED:
                event = POST_VERIFICAITON_EVENTS.POST_CREATED_UNVERIFIED;
                break;
            case VERIFICATION_TYPES.UPDATED:
                event = POST_VERIFICAITON_EVENTS.POST_UPDATED_UNVERIFIED;
                break;
            case VERIFICATION_TYPES.DELETED:
                event = POST_VERIFICAITON_EVENTS.POST_DELETED_UNVERIFIED;
                break;
        }

        try {
            verification.status = VERIFICATION_STATUS.UNVERIFIED;
            verification.manager_id = verifyOptions.manager_id;
            await verification.save();
            this.eventEmitter.emitAsync(event, { verification });
            return {
                code: 0,
                data: verification.verification_id,
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }

    async verify(
        id: string,
        verifyOptions: VerifyOptions,
    ): Promise<CommitActionResult<string>> {
        const verification = await this.verificationModel.findOne({
            verification_id: id,
        });
        if (!verification) {
            return POST_ERRORS.VerificationNotFound;
        }
        let event: string = null;
        switch (verification.type) {
            case VERIFICATION_TYPES.CREATED:
                event = POST_VERIFICAITON_EVENTS.POST_CREATED_VERIFIED;
                break;
            case VERIFICATION_TYPES.UPDATED:
                event = POST_VERIFICAITON_EVENTS.POST_UPDATED_VERIFIED;
                break;
            case VERIFICATION_TYPES.DELETED:
                event = POST_VERIFICAITON_EVENTS.POST_DELETED_VERIFIED;
                break;
        }

        try {
            verification.status = VERIFICATION_STATUS.VERIFIED;
            verification.manager_id = verifyOptions.manager_id;
            await verification.save();
            this.eventEmitter.emitAsync(event, { verification });
            return {
                code: 0,
                data: verification.verification_id,
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }

    async getVerficationById(
        id: string,
        queryOptions?: QueryOptions,
    ): Promise<PostVerification> {
        const { managerId } = queryOptions;
        const builder = new AggregateBuilder();
        builder
            .match({
                verification_id: id,
            })
            .match({
                manager_id: managerId,
            });
        this.verificationHelper.groupWithPosts(builder, {
            metadata: true,
            topic: true,
        });
        const results = await this.verificationModel.aggregate(builder.build());
        if (results.length === 0) {
            return null;
        }
        return results[0];
    }

    async findVerifications(
        input: SearchVerificationDTO,
        queryOptions?: QueryOptions,
        limitOptions?: LimitOptions,
    ): Promise<any> {
        const { type, sortBy: sortField, sortOrder, status, search } = input;
        const { start, limit } = limitOptions;
        const { managerId = null, authorId = null, groups = [] } =
            queryOptions ?? {};
        const builder = new AggregateBuilder();
        this.verificationHelper
            .filter(builder, { authorId, managerId, type, status, search })
            .sort(builder, { sortField, sortOrder })
            .group(builder, groups)
            .limit(builder, {
                start,
                limit,
            });
        const queryResult = await this.verificationModel
            .aggregate(builder.log(null).build())
            .exec();

        const [{ results, count }] = queryResult;
        return {
            count,
            results,
        };
    }

    async batchDelete(verificationIds: string[], creatorId: string) {
        try {
            const result = await this.verificationModel.deleteMany(
                {
                    author_id: creatorId,
                    verification_id: {
                        $in: verificationIds,
                    },
                    status: {
                        $in: [
                            VERIFICATION_STATUS.VERIFIED,
                            VERIFICATION_STATUS.UNVERIFIED,
                        ],
                    },
                },
                {
                    multipleCastError: true,
                },
            );
            return {
                code: 0,
                data: {
                    deleted: result.deletedCount,
                    deletedFailed: result.n - result.deletedCount,
                },
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }

    async createVerification(
        dto: CreateVerificationDTO,
    ): Promise<CommitActionResult<PostVerification>> {
        const { post_info, ...input } = dto;
        const verification = await this.verificationModel.findOne({
            post_id: dto.post_id,
            status: VERIFICATION_STATUS.PENDING,
        });
        if (verification) {
            return POST_ERRORS.PostIsPending;
        }
        try {
            input["post_title"] = post_info?.post_title;
            input["status"] = VERIFICATION_STATUS.PENDING;
            const verification = await this.verificationModel.create(input);
            this.eventEmitter.emitAsync(
                POST_VERIFICAITON_EVENTS.VERIFICATION_CREATED,
                verification,
            );
            return {
                code: 0,
                data: verification,
            };
        } catch (err) {
            this.logger.error(err);
            return POST_ERRORS.ServiceError;
        }
    }
}
