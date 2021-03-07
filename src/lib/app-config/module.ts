import { DynamicModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_CONFIG, APP_ENV_CONFIG } from "./consts";
import { AppConfigModuleOptions } from "./interfaces";

@Module({
    imports: [ConfigModule],
})
export class AppConfigModule {
    static forRoot(options: AppConfigModuleOptions): DynamicModule {
        const { appConfigClass, appEnvConfigClass } = options;
        if (!appConfigClass) {
            throw new Error("Invalid app configuration class");
        }
        return {
            module: AppConfigModule,
            global: true,
            providers: [
                {
                    provide: APP_CONFIG,
                    useClass: appConfigClass,
                },
                {
                    provide: APP_ENV_CONFIG,
                    useClass: appEnvConfigClass,
                },
            ],
            exports: [APP_CONFIG, APP_ENV_CONFIG],
        };
    }
}
