import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EncryptService } from "src/lib/encrypt";
import {
    AuthUserDTO,
    AuthTokenDTO,
    CreateUserOptions,
    ServiceResult,
    UpdatePasswordOptions,
} from "./dtos";
import { AuthToken, AuthUserModel } from "./models";

export interface IAuthUserService {
    createUser(
        input: CreateUserOptions,
    ): Promise<ServiceResult<{ user_id: string }>>;

    findRootUser(usernameOrId: string): Promise<AuthUserDTO>;
    findUser(usernameOrId: string): Promise<AuthUserDTO>;

    updatePassword(
        userId: string,
        options: UpdatePasswordOptions,
    ): Promise<ServiceResult<{ user_id: string }>>;
}

@Injectable()
export class AuthUserService implements IAuthUserService {
    constructor(
        @InjectModel(AuthUserModel.name)
        private readonly userModel: Model<AuthUserModel>,
        @InjectModel(AuthToken.name)
        private readonly authTokenModel: Model<AuthToken>,
        private readonly encrypter: EncryptService,
        private readonly logger: Logger,
    ) {}

    async findRootUser() {
        const user = await this.userModel.findOne({
            type: "root",
        });
        if (!user) {
            return null;
        }
        return new AuthUserDTO(user);
    }

    async findUserAuthToken(userId: string) {
        const token = await this.authTokenModel.findOne({
            user_id: userId,
        });
        if (!token) {
            return null;
        }
        return new AuthTokenDTO(token.toObject());
    }

    async findUser(usernameOrId: string): Promise<AuthUserDTO> {
        const user = await this.userModel.findOne({
            $or: [{ _id: usernameOrId }, { username: usernameOrId }],
        });
        if (!user) {
            return null;
        }
        return new AuthUserDTO(user);
    }

    async updatePassword(userId: string, options: UpdatePasswordOptions) {
        try {
            const { newPassword } = options;
            const passwordHash = await this.encrypter.hash(newPassword);
            const result = await this.userModel.findByIdAndUpdate(
                userId,
                {
                    password: passwordHash,
                },
                {
                    upsert: false,
                    useFindAndModify: false,
                    multipleCastError: true,
                },
            );
            if (result) {
                return {
                    code: 0,
                    data: {
                        user_id: result._id,
                    },
                };
            }
        } catch (err) {
            return {
                code: -1,
                error: err,
            };
        }
    }

    async createUser(input: CreateUserOptions) {
        try {
            const password = await this.encrypter.hash(input.password);
            input.password = password;
            const user = await this.userModel.create(input);
            return {
                code: 0,
                data: {
                    user_id: user._id,
                },
            };
        } catch (err) {
            this.logger.verbose(err);
            return {
                code: -1,
                error: err,
            };
        }
    }
}
