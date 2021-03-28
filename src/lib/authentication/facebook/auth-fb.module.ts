import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationCoreModule } from "../core";
import { MailVerificationModule } from "../verifications/mail-verification";
import { FacebookUserService } from "./auth-fb.service";
import { FacebookStrategy } from "./auth-fb.strategy";
import { FACEBOOK_AUTH_CONFIG, VERIFICATION_ENDPOINT } from "./consts";
import { FacebookAppConfig, ForRootModuleOptions } from "./interfaces";
import configLoader from "./auth-fb.config";
import { FacebookAuthController, UserVerifyController } from "./controllers";
import { APP_CONFIG, IAppConfig } from "src/lib/app-config";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
        }),
        AuthenticationCoreModule.forFeature({
            useVerification: true,
        }),
        MailVerificationModule.forRootAsync({
            imports: [ConfigModule],
            mailConfigProvider: {
                useFactory: (
                    configService: ConfigService,
                    appConfig: IAppConfig,
                ) => {
                    const endpoint = `${appConfig.serverDomain()}${configService.get(
                        VERIFICATION_ENDPOINT,
                    )}`;
                    return {
                        defaultSubject: "Xác nhận trạng thái đăng nhập",
                        endpoint,
                    };
                },
                inject: [ConfigService, APP_CONFIG],
            },
        }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("FacebookAuthentication"),
        },
        {
            provide: FACEBOOK_AUTH_CONFIG,
            useFactory: (
                configService: ConfigService,
                appGlobalConfig: IAppConfig,
            ) => {
                const credentials = configService.get(FACEBOOK_AUTH_CONFIG);
                const callbackURL = `${appGlobalConfig.serverDomain()}/auth/facebook/redirect`;
                return {
                    ...credentials,
                    callbackURL,
                    scope: "email",
                    profileFields: ["emails", "name", "displayName", "photos"],
                } as FacebookAppConfig;
            },
            inject: [ConfigService, APP_CONFIG],
        },
        FacebookStrategy,
        FacebookUserService,
    ],
    exports: [FacebookUserService],
    controllers: [FacebookAuthController, UserVerifyController],
})
export class AuthFacebookModule {}
