import { DynamicModule, Logger, Module } from "@nestjs/common";
import { CONFIG_KEY } from "./consts";
import { ForFeatureOptions } from "./interfaces";
import { MailService } from "./mail-service.service";

@Module({})
export class MailServiceModule {
    static forFeature(options: ForFeatureOptions): DynamicModule {
        const { useFactory, imports, inject } = options;
        return {
            module: MailServiceModule,
            imports,
            providers: [
                {
                    provide: Logger,
                    useValue: new Logger("MailService"),
                },
                {
                    provide: CONFIG_KEY,
                    useFactory,
                    inject,
                },
                MailService,
            ],
            exports: [MailService],
        };
    }
}
