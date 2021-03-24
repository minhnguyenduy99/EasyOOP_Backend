import { createTestAccount } from "nodemailer";
import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationCore } from "../core";
import { MailVerificationModule } from "../verifications/mail-verification";
import { AuthFacebookService } from "./auth-fb.service";
import { FacebookStrategy } from "./auth-fb.strategy";
import { FACEBOOK_AUTH_CONFIG, VERIFICATION_CONFIG } from "./consts";
import { ForRootModuleOptions } from "./interfaces";
import configLoader from "./auth-fb.config";
import { FacebookAuthController } from "./controllers";

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
                    return configService.get(VERIFICATION_CONFIG)?.mailConfig;
                },
                inject: [ConfigService],
            },
            transportConfigProvider: {
                useFactory: async (configService: ConfigService) => {
                    const defaultConfig = configService.get(VERIFICATION_CONFIG)
                        ?.transport;
                    const testAccount = await createTestAccount();
                    return {
                        ...defaultConfig,
                        auth: {
                            user: testAccount.user,
                            pass: testAccount.pass,
                        },
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
    controllers: [FacebookAuthController],
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
