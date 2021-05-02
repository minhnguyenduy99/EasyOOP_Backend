import { Inject, Logger } from "@nestjs/common";
import { v4 as uidv4 } from "uuid";
import { Model } from "mongoose";
import { AuthUser } from "../models";
import { ACCOUNT_TYPES, LOGIN_STATUSES } from "../consts";
import {
    AuthUserDTO,
    CreateUserDTO,
    ServiceResult,
    UserProfileDTO,
} from "../dtos";
import { EncryptService } from "src/lib/encrypt";
import { MongoErrors } from "src/lib/database/mongo";
import { EventEmitter2 } from "eventemitter2";
import { USER_EVENTS } from "../events";
import { InjectModel } from "@nestjs/mongoose";
import { GlobalAuthUserService } from "./auth-user.service";

export interface IAuthUserService {
    createUser(input: CreateUserDTO): Promise<ServiceResult<AuthUser>>;
    activateUser(
        userId: string,
        role: string,
    ): Promise<ServiceResult<AuthUser>>;
    updateUserProfile(
        userId: string,
        profile: any,
    ): Promise<ServiceResult<AuthUser>>;
}

export abstract class BaseAuthUserService implements IAuthUserService {
    @InjectModel(AuthUser.name)
    protected readonly userModel: Model<AuthUser>;
    @Inject(EncryptService)
    protected readonly encryptService: EncryptService;
    @Inject(Logger)
    protected readonly logger: Logger;
    @Inject(EventEmitter2)
    protected readonly eventEmitter: EventEmitter2;

    @Inject(GlobalAuthUserService)
    protected readonly globalUserService: GlobalAuthUserService;

    async createUser(input: CreateUserDTO) {
        const {
            password,
            isActive,
            role = this.globalUserService.getDefaultRole(),
        } = input;
        const [profile, extractedUser, passwordHash] = await Promise.all([
            this.extractProfile(input),
            this.extractUser(input),
            this.generatePasswordHash(password),
        ]);
        const inputDoc = {
            ...extractedUser,
            password_hash: extractedUser.password_required
                ? passwordHash
                : null,
            login_status: LOGIN_STATUSES.UNLOGINED,
            is_active: isActive,
            profile,
            type: this.getUserType(),
            roles: [role],
        };
        try {
            const user = await this.userModel.create(inputDoc);
            this.eventEmitter.emitAsync(USER_EVENTS.UserCreated, { user });
            return {
                code: 0,
                data: user,
            };
        } catch (err) {
            this.logger.verbose(err);
            const error = MongoErrors.isDuplicateKeyError(err);
            err = error ?? {
                message: "Create user error",
            };
            return {
                code: -1,
                error: err,
            };
        }
    }

    async activateUser(userId: string, role: string) {
        const user = await this.userModel.findOne({
            user_id: userId,
        });
        if (!user || user?.roles.indexOf(role) === -1) {
            return {
                code: -1,
                error: "User not found",
            };
        }
        user.is_active = true;
        user.active_role = role;
        try {
            await user.save();
            this.eventEmitter.emitAsync(USER_EVENTS.UserActivated, {
                user,
            });
        } catch (err) {
            this.logger.verbose(err);
            return {
                code: -10,
                error: "Service failed",
            };
        }
    }

    async updateUserProfile(userId: string, profile: any) {
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

    abstract getUserType(): string;

    isUserLogined(user: AuthUser | AuthUserDTO) {
        return user.login_status === LOGIN_STATUSES.LOGINED;
    }

    protected async generatePasswordHash(
        password: string = null,
    ): Promise<string> {
        password = password ?? uidv4();
        return this.encryptService.hash(password);
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
