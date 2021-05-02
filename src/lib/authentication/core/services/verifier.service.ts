import { v4 as uuidv4 } from "uuid";
import { Injectable, Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { IVerificationSender } from "../core.interfaces";
import {
    AuthUserDTO,
    CreateVerifierDTO,
    ServiceResult,
    VerifierDTO,
} from "../dtos";
import { AuthUser, Verifier } from "../models";
import { InjectModel } from "@nestjs/mongoose";

export interface IUserVerifier {
    createVerify(
        user: AuthUser | AuthUserDTO,
        input?: CreateVerifierDTO,
    ): Promise<ServiceResult<VerifierDTO>>;
    verify(code: string): Promise<ServiceResult<{}>>;
}

@Injectable()
export class UserVerifier implements IUserVerifier {
    protected readonly DEFAULT_EXPIRED_TIMESPAN = 3600 * 6 * 1000; // 6 hours
    protected verifySender: IVerificationSender;

    constructor(
        @InjectModel(Verifier.name)
        protected readonly verifierModel: Model<Verifier>,
        @InjectModel(AuthUser.name)
        protected readonly authUserModel: Model<AuthUser>,
        protected logger: Logger,
    ) {}

    useVerificationSender(sender: IVerificationSender) {
        this.verifySender = sender;
    }

    async createVerify(
        user: AuthUser | AuthUserDTO,
        input?: CreateVerifierDTO,
    ) {
        if (user.is_active) {
            return {
                code: -1,
                error: "User is already active",
            };
        }
        const inputDoc = {
            ...input,
            user_id: user.user_id,
            expired_in:
                Date.now() +
                (input?.expired_in ?? this.DEFAULT_EXPIRED_TIMESPAN),
            verify_code: uuidv4(),
            verify_method: this.verifySender.getVerifyMethod(),
        };
        try {
            const verifier = await this.verifierModel.findOneAndUpdate(
                {
                    user_id: user.user_id,
                },
                inputDoc,
                {
                    upsert: true,
                    new: true,
                    multipleCastError: true,
                    useFindAndModify: false,
                },
            );
            const verifierDTO = {
                ...verifier.toObject(),
                user: user?.["toObject"]() ?? user,
            };
            await this.verifySender.sendVerification(verifierDTO);
            return {
                code: 0,
                data: verifierDTO,
            };
        } catch (err) {
            this.logger.error(err);
            return {
                code: -10,
                error: "Verify error",
            };
        }
    }

    async verify(verifyCode: string) {
        const verifier = await this.verifierModel.findOne({
            verify_code: verifyCode,
        });
        if (!verifier) {
            return {
                code: -1,
                error: "Invalid verification code",
            };
        }
        if (this.isVerifyCodeExpired(verifier)) {
            return {
                code: -2,
                error: "Verification code is expired",
            };
        }
        try {
            await Promise.all([
                this.authUserModel.updateOne(
                    {
                        user_id: verifier.user_id,
                    },
                    {
                        is_active: true,
                    },
                ),
                verifier.delete(),
            ]);
            return {
                code: 0,
            };
        } catch (err) {
            return {
                code: -10,
                error: "Verify error",
            };
        }
    }

    protected isVerifyCodeExpired(verifier: Verifier) {
        return verifier.expired_in < Date.now();
    }
}
