import { DynamicModule, Logger, Module } from "@nestjs/common";
import {
    HTML_FORMATTER,
    MAIL_SERVICE_CONFIG,
    TRANSPORTER_CONFIG,
} from "./consts";
import {
    ForRootModuleOptions,
    MailServiceConfig,
    TransporterConfig,
} from "./interfaces";
import { MailVerification } from "./mail-verification.service";

@Module({
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
    static forRoot(
        transportConfig: TransporterConfig,
        mailConfig: MailServiceConfig,
    ): DynamicModule {
        return {
            module: MailVerificationModule,
            providers: [
                {
                    provide: TRANSPORTER_CONFIG,
                    useValue: transportConfig,
                },
                {
                    provide: MAIL_SERVICE_CONFIG,
                    useValue: mailConfig,
                },
                ...[
                    mailConfig.htmlFormatter && {
                        provide: HTML_FORMATTER,
                        useValue: mailConfig.htmlFormatter,
                    },
                ],
            ],
        };
    }

    static forRootAsync(config: ForRootModuleOptions): DynamicModule {
        const { imports, mailConfigProvider, transportConfigProvider } = config;
        return {
            module: MailVerificationModule,
            imports,
            providers: [
                {
                    provide: TRANSPORTER_CONFIG,
                    ...transportConfigProvider,
                },
                {
                    provide: MAIL_SERVICE_CONFIG,
                    ...mailConfigProvider,
                },
            ],
        };
    }
}
