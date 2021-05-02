import { Inject, Injectable, Optional } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { EncryptService } from "src/lib/encrypt";
import { GlobalAuthUserService } from "./auth-user.service";
import { LOGIN_STATUSES, PROVIDER } from "../consts";
import { AuthUserDTO, ServiceResult, ValidateUserOptions } from "../dtos";
import {
    AccessTokenPayload,
    LoginResult,
    RefreshTokenPayload,
    TokenConfig,
} from "../interfaces";
import { AuthUser } from "../models";
import { JwtTimeConverter } from "../utils";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

export interface IAuthenticationService {
    logIn(
        userId: string,
        role: string,
        payload?: any,
    ): Promise<ServiceResult<LoginResult>>;
    validateUser(
        usernameOrEmail: string,
        validateOptions?: ValidateUserOptions,
    ): Promise<ServiceResult<AuthUser>>;
    validateAccessTokenPayload(payload: AccessTokenPayload): Promise<AuthUser>;
    validateRefreshTokenPayload(
        payload: RefreshTokenPayload,
    ): Promise<AuthUser>;
    generateAccessToken(user: AuthUserDTO | AuthUser): Promise<string>;
}

@Injectable()
export class AuthenticationService implements IAuthenticationService {
    constructor(
        private encryptService: EncryptService,
        private jwtService: JwtService,
        @Inject(PROVIDER.TOKEN_CONFIG)
        private readonly tokenConfig: TokenConfig,
        private userService: GlobalAuthUserService,
        @InjectModel(AuthUser.name) private userModel: Model<AuthUser>,
    ) {}

    async validateUser(
        usernameOrEmail: string,
        validateOptions?: ValidateUserOptions,
    ): Promise<ServiceResult<AuthUser>> {
        const user = await this.userService.getUserByUsernameOrEmail(
            usernameOrEmail,
        );
        if (!user) {
            return {
                code: -1,
                error: "User not found",
            };
        }
        if (!user.password_required) {
            return {
                code: 0,
                data: user,
            };
        }
        const { password } = validateOptions ?? {};
        const isPasswordValid = await this.encryptService.compare(
            password,
            user.password,
        );
        if (isPasswordValid) {
            return {
                code: 0,
                data: user,
            };
        }
        return {
            code: -2,
            error: "Password is incorrect",
        };
    }

    async validateAccessTokenPayload(payload: AccessTokenPayload) {
        const user = await this.userService.getUserById(payload.user_id);
        if (!user || user.active_role !== payload.active_role) {
            return null;
        }
        return user;
    }

    async validateRefreshTokenPayload(payload: RefreshTokenPayload) {
        const user = await this.userService.getUserById(payload.user_id);
        if (!this.isUserLogined(user)) {
            return null;
        }
        return user;
    }

    async validateRefreshToken(refreshToken: string) {
        try {
            const payload = (await this.jwtService.verifyAsync(refreshToken, {
                secret: this.tokenConfig.refreshTokenSecretKey,
            })) as RefreshTokenPayload;
            let user = await this.validateRefreshTokenPayload(payload);
            if (!user) {
                return false;
            }
            const isTokenMatch = await this.encryptService.compare(
                refreshToken,
                user.hash_refresh_token,
            );
            return isTokenMatch ? user : false;
        } catch (err) {
            return false;
        }
    }

    async generateAccessToken(user: AuthUserDTO | AuthUser, payload?: any) {
        const { user_id, active_role, ...outputPayload } = payload ?? {};
        const accessTokenPayload = {
            user_id: user.user_id,
            active_role: user.active_role,
            ...outputPayload,
        } as AccessTokenPayload;

        const { accessTokenExpired, accessTokenSecretKey } = this.tokenConfig;
        const accessToken = await this.jwtService.sign(accessTokenPayload, {
            secret: accessTokenSecretKey,
            expiresIn: accessTokenExpired,
        });
        return accessToken;
    }

    async logIn(
        userId: string | AuthUser,
        role?: string,
        payload?: any,
    ): Promise<ServiceResult<LoginResult>> {
        let user: AuthUser = userId as AuthUser;
        role = role ?? this.userService.getDefaultRole();

        if (typeof userId === "string") {
            user = await this.userService.getUserById(userId);
        }
        if (!user || user.roles.indexOf(role) === -1) {
            return {
                code: -1,
                error: "User is invalid",
            };
        }
        try {
            const [refreshToken, accessToken] = await Promise.all([
                this.generateRefreshToken(user),
                this.generateAccessToken(user, payload),
            ]);
            const hashRefreshToken = await this.encryptService.hash(
                refreshToken,
            );
            const issuedAt = Date.now();
            const expire = JwtTimeConverter.JwtTimeToExpiredDate(
                issuedAt,
                new String(this.tokenConfig.refreshTokenExpired),
            );
            await this.updateUserLoginState(user, {
                hashRefreshToken,
                expire,
                role,
            });
            return {
                code: 0,
                data: {
                    user,
                    accessToken,
                    refreshToken,
                },
            };
        } catch (err) {
            console.log(err);
            return {
                code: -10,
                error: "Login user failed",
            };
        }
    }

    protected async updateUserLoginState(user: AuthUser | any, opts) {
        const { hashRefreshToken, expire, role } = opts;
        if (!user) {
            return;
        }
        user.hash_refresh_token = hashRefreshToken;
        user.token_expired = expire;
        user.login_status = LOGIN_STATUSES.LOGINED;
        user.active_role = role;
        if (user instanceof AuthUser) {
            await user.save();
            return;
        }
        await this.userModel.updateOne(
            {
                user_id: user.user_id,
            },
            user,
        );
    }

    protected generateRefreshToken(user: AuthUser) {
        const payload = {
            user_id: user.user_id,
        } as RefreshTokenPayload;
        const { refreshTokenSecretKey, refreshTokenExpired } = this.tokenConfig;
        const refreshToken = this.jwtService.sign(payload, {
            secret: refreshTokenSecretKey,
            expiresIn: refreshTokenExpired,
        });
        return refreshToken;
    }

    protected isUserLogined(user: AuthUser | AuthUserDTO) {
        return user.login_status === LOGIN_STATUSES.LOGINED;
    }
}
