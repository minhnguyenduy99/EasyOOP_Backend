import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { EncryptModule } from "../../encrypt";

import { LocalAuthService } from "./local-auth.service";
import { CONFIG_KEY, LocalAuthConfigLoader } from "./config";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";
import { LocalAuthStrategy } from "./strategies/local-auth.strategy";
import {
    AuthUserModel,
    AuthUserSchema,
    AuthToken,
    AuthTokenSchema,
} from "./models";
import { AuthUserService } from "./auth-user.service";
import { AttachTokenInterceptor } from "./interceptors";
import { LOCAL_AUTH_CONFIG } from "./consts";
import { LocalAuthModuleConfig } from "./local-auth.interfaces";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AuthUserModel.name, schema: AuthUserSchema },
            { name: AuthToken.name, schema: AuthTokenSchema },
        ]),
        PassportModule,
        ConfigModule.forRoot({
            load: [LocalAuthConfigLoader],
        }),
        EncryptModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                const secretKey = config.get(CONFIG_KEY.accessTokenSecretKey);
                const expires = config.get(CONFIG_KEY.accessTokenExpires);
                return {
                    secret: secretKey,
                    signOptions: {
                        expiresIn: expires,
                    },
                };
            },
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    providers: [
        LocalAuthService,
        AuthUserService,
        AccessTokenStrategy,
        LocalAuthStrategy,
        {
            provide: Logger,
            useValue: new Logger("LocalAut"),
        },
        {
            provide: LOCAL_AUTH_CONFIG,
            useFactory: (config: ConfigService) => {
                return {
                    accessTokenMaxAge: config.get(
                        CONFIG_KEY.accessTokenExpires,
                    ),
                    accessTokenSecretKey: config.get(
                        CONFIG_KEY.accessTokenSecretKey,
                    ),
                    refreshTokenMaxAge: config.get(
                        CONFIG_KEY.refreshTokenExpires,
                    ),
                    refreshTokenSecretKey: config.get(
                        CONFIG_KEY.accessTokenSecretKey,
                    ),
                } as LocalAuthModuleConfig;
            },
            inject: [ConfigService],
        },
        AttachTokenInterceptor,
    ],
    exports: [
        LocalAuthService,
        AuthUserService,
        AccessTokenStrategy,
        AttachTokenInterceptor,
        LOCAL_AUTH_CONFIG,
    ],
})
export class LocalAuthModule implements OnModuleInit {
    protected root: any;
    constructor(
        private userService: AuthUserService,
        private configService: ConfigService,
        private logger: Logger,
    ) {}

    async onModuleInit() {
        await this.createRootUser();
    }

    protected async createRootUser() {
        const username = this.configService.get(CONFIG_KEY.rootUsername);
        const password = this.configService.get(CONFIG_KEY.rootPassword);
        if (!username || !password) {
            this.logger.warn("Root user is not configured properly");
            return;
        }
        const user = await this.userService.findRootUser();
        if (user) {
            return;
        }
        const result = await this.userService.createUser({
            username,
            password,
            type: "root",
        });
        if (result.code === 0) {
            this.logger.log("Root user is configured");
        } else {
            this.logger.error("Cannot configure root user");
        }
    }
}
