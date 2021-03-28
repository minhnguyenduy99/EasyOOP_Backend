import { Logger } from "@nestjs/common";
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

export interface IAuthUserService {
    createUser(input: CreateUserDTO): Promise<ServiceResult<AuthUser>>;
    getUserById(userId: string): Promise<AuthUser>;
    getUserByEmail(email: string): Promise<AuthUser>;
    getUserByUsernameOrEmail(usernameOrEmail: string): Promise<AuthUser>;
    updateUserProfile(
        userId: string,
        profile: any,
    ): Promise<ServiceResult<AuthUser>>;
}

export abstract class BaseAuthUserService implements IAuthUserService {
    constructor(
        protected readonly userModel: Model<AuthUser>,
        protected readonly encryptService: EncryptService,
        protected readonly logger: Logger,
    ) {}

    async createUser(input: CreateUserDTO) {
        const { password } = input;
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
            is_active: false,
            profile,
            type: this.getUserType(),
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

    async getUserByUsernameOrEmail(usernameOrEmail: string) {
        const user = await this.userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        return user;
    }

    async getUserById(userId: string) {
        const user = await this.userModel.findOne({
            user_id: userId,
        });
        return user;
    }

    async getUserByEmail(userEmail: string) {
        const user = await this.userModel.findOne({
            email: userEmail,
        });
        return user;
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
