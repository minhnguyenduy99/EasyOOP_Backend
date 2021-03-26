import { DynamicModule, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailServiceModule, MailServiceConfig } from "src/lib/mail-service";
import { MAIL_SERVICE_CONFIG } from "./consts";
import { ForRootModuleOptions, MailServiceConfigOptions } from "./interfaces";
import { MailVerification } from "./mail-verification.service";
import configLoader, { KEYS } from "./config";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
        }),
        MailServiceModule.forFeature({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    requestUrl: configService.get(KEYS.endpoint),
                } as MailServiceConfig;
            },
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("MailVerification"),
        },
        MailVerification,
    ],
    exports: [MailVerification],
})
export class MailVerificationModule {
    static forRoot(mailConfig: MailServiceConfigOptions): DynamicModule {
        return {
            module: MailVerificationModule,
            providers: [
                {
                    provide: MAIL_SERVICE_CONFIG,
                    useValue: mailConfig,
                },
            ],
        };
    }

    static forRootAsync(config: ForRootModuleOptions): DynamicModule {
        const { imports, mailConfigProvider } = config;
        const providers = [];
        providers.push({
            provide: MAIL_SERVICE_CONFIG,
            ...mailConfigProvider,
        });
        return {
            module: MailVerificationModule,
            imports,
            providers,
        };
    }
}
