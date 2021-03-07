import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EncryptService } from "src/lib/encrypt";
import { AuthUserDTO } from "./dtos";
import {
    AccessTokenPayload,
    LocalAuthModuleConfig,
    RefreshTokenPayload,
} from "./local-auth.interfaces";
import { JwtTimeConverter } from "./utils";
import { AuthUserModel, AuthToken } from "./models";
import { LOCAL_AUTH_CONFIG } from "./consts";

@Injectable()
export class LocalAuthService {
    constructor(
        @InjectModel(AuthUserModel.name)
        private readonly userModel: Model<AuthUserModel>,
        @InjectModel(AuthToken.name)
        private readonly authTokenModel: Model<AuthToken>,
        private readonly encryptService: EncryptService,
        private readonly jwtService: JwtService,
        @Inject(LOCAL_AUTH_CONFIG)
        private readonly authConfig: LocalAuthModuleConfig,
    ) {}

    async logOut(userId: string) {
        const result = await this.authTokenModel.deleteOne({
            user_id: userId,
        });
        return result.ok === 1;
    }

    async validateUser(username: string, password: string) {
        const user = await this.userModel.findOne({
            username,
        });
        if (!user) {
            return null;
        }
        const passwordMatch = await this.encryptService.compare(
            password,
            user.password,
        );
        if (!passwordMatch) {
            return null;
        }
        return new AuthUserDTO(user);
    }

    async validateAccessTokenPayload(payload: AccessTokenPayload) {
        const user = await this.userModel.findById(payload.uid, {
            password: -1,
        });
        if (!user) {
            return null;
        }
        return new AuthUserDTO(user);
    }

    async validateRefreshTokenPayload(payload: RefreshTokenPayload) {
        const [user, authToken] = await Promise.all([
            this.userModel.findById(payload.uid, {
                password: -1,
            }),
            this.authTokenModel.findOne({ user_id: payload.uid }),
        ]);
        if (!user || !authToken || user.id !== authToken.user_id) {
            return null;
        }
        return new AuthUserDTO(user);
    }

    async validateRefreshToken(refreshToken: string) {
        try {
            const payload = (await this.jwtService.verifyAsync(refreshToken, {
                secret: this.authConfig.refreshTokenSecretKey,
            })) as RefreshTokenPayload;
            const authToken = await this.authTokenModel.findOne({
                user_id: payload.uid,
            });
            if (!authToken) {
                return null;
            }
            const isTokenMatch = await this.encryptService.compare(
                refreshToken,
                authToken.hash_refresh_token,
            );
            const user = await this.validateRefreshTokenPayload(payload);
            return isTokenMatch ? user : false;
        } catch (err) {
            return false;
        }
    }

    async validateAccessToken(token: string) {
        const payload = await this.jwtService.verifyAsync(token);
        return payload as AccessTokenPayload;
    }

    async generateAccessToken(user: AuthUserDTO) {
        const accessTokenPayload = {
            uid: user.uid,
        } as AccessTokenPayload;

        const { accessTokenMaxAge, accessTokenSecretKey } = this.authConfig;
        const accessToken = await this.jwtService.sign(accessTokenPayload, {
            secret: accessTokenSecretKey,
            expiresIn: accessTokenMaxAge,
        });
        return accessToken;
    }

    async generateRefreshToken(user: AuthUserDTO) {
        const payload = {
            uid: user.uid,
        } as RefreshTokenPayload;
        const { refreshTokenSecretKey, refreshTokenMaxAge } = this.authConfig;
        const refreshToken = this.jwtService.sign(payload, {
            secret: refreshTokenSecretKey,
            expiresIn: refreshTokenMaxAge,
        });
        const hashRefreshToken = await this.encryptService.hash(refreshToken);
        const issuedAt = Date.now();
        const expiredTime = JwtTimeConverter.JwtTimeToExpiredDate(
            issuedAt,
            new String(refreshTokenMaxAge),
        );
        await this.authTokenModel.updateOne(
            {
                user_id: user._id,
            },
            {
                user_id: user._id,
                hash_refresh_token: hashRefreshToken,
                expired_in: expiredTime.getTime(),
            },
            {
                upsert: true,
            },
        );
        return refreshToken;
    }
}
