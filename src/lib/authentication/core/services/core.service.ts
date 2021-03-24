import { Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { AuthUser } from "../models";
import { ACCOUNT_TYPES } from "../consts";
import { AuthUserDTO, CreateUserDTO, UserProfileDTO } from "../dtos";

export abstract class AuthenticationCoreService {
    constructor(
        protected readonly userModel: Model<AuthUser>,
        protected readonly logger: Logger,
    ) {}

    async createUser(input: CreateUserDTO) {
        const { accountType } = input;
        if (!this.isAccountTypeValid(accountType)) {
            return {
                code: -1,
                error: "Invalid account type",
            };
        }
        const [profile, extractedUser] = await Promise.all([
            this.extractProfile(input),
            this.extractUser(input),
        ]);
        const inputDoc = {
            ...extractedUser,
            profile,
        };
        try {
            const user = await this.userModel.create(inputDoc);
            return {
                code: 0,
                data: user,
            };
        } catch (err) {
            this.logger.verbose(err);
            return {
                code: -1,
                error: err,
            };
        }
    }

    findUserById(userId: string) {
        return this.userModel.findOne({
            user_id: userId,
        });
    }

    async updateProfile(userId: string, profile: any) {
        const inputProfile = await this.extractProfile(profile);
        try {
            const user = await this.userModel.findOneAndUpdate(
                {
                    user_id: userId,
                },
                {
                    profile: inputProfile,
                },
                {
                    useFindAndModify: false,
                },
            );
            if (!user) {
                return {
                    code: -1,
                    error: "User not found",
                };
            }
            return {
                code: 0,
                data: user.profile,
            };
        } catch (err) {
            this.logger.verbose(err);
            return {
                code: -2,
                error: err.message,
            };
        }
    }

    protected abstract extractProfile<User extends any>(
        dto: User,
    ): UserProfileDTO | Promise<UserProfileDTO>;

    protected abstract extractUser<User extends any>(
        dto: User,
    ): AuthUserDTO | Promise<AuthUserDTO>;

    protected isAccountTypeValid(accountType: string) {
        return ACCOUNT_TYPES.includes(accountType.toLowerCase());
    }
}
