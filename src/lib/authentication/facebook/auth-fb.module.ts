import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationCore } from "../core";
import { MailVerificationModule } from "../verifications/mail-verification";
import { AuthFacebookService } from "./auth-fb.service";
import { FacebookStrategy } from "./auth-fb.strategy";
import { FACEBOOK_AUTH_CONFIG, VERIFICATION_ENDPOINT } from "./consts";
import { ForRootModuleOptions } from "./interfaces";
import configLoader from "./auth-fb.config";
import { FacebookAuthController, UserVerifyController } from "./controllers";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
        }),
        AuthenticationCore.forFeature({
            useVerification: true,
        }),
        MailVerificationModule.forRootAsync({
            imports: [ConfigModule],
            mailConfigProvider: {
                useFactory: (configService: ConfigService) => {
                    return {
                        defaultSubject: "Xác nhận trạng thái đăng nhập",
                        endpoint: configService.get(VERIFICATION_ENDPOINT),
                    };
                },
                inject: [ConfigService],
            },
        }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("FacebookAuthentication"),
        },
        FacebookStrategy,
        AuthFacebookService,
    ],
    exports: [AuthFacebookService],
    controllers: [FacebookAuthController, UserVerifyController],
})
export class AuthFacebookModule {
    static forRoot(config: ForRootModuleOptions): DynamicModule {
        return {
            module: AuthFacebookModule,
            providers: [
                {
                    provide: FACEBOOK_AUTH_CONFIG,
                    useFactory: (configService: ConfigService) => {
                        const credentials = configService.get(
                            FACEBOOK_AUTH_CONFIG,
                        );
                        return {
                            ...credentials,
                            ...config,
                        };
                    },
                    inject: [ConfigService],
                },
            ],
        };
    }
}
