import { DynamicModule, Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PROVIDERS } from "./consts";
import { DataLoaderConfig, ModuleConfig } from "./interfaces";
import { DataLoader } from "./service";

@Module({
    providers: [
        {
            provide: Logger,
            useValue: new Logger("MongoDataLoaderModule"),
        },
    ],
})
export class MongoDataLoaderModule {
    static forRoot(config: DataLoaderConfig): DynamicModule {
        const {
            path,
            cleanFirst = true,
            modelNameHandler = (path: string) => path,
        } = config;
        return {
            module: MongoDataLoaderModule,
            providers: [
                {
                    provide: PROVIDERS.CONFIG,
                    useValue: {
                        path,
                        cleanFirst,
                        modelNameHandler,
                    } as DataLoaderConfig,
                },
                DataLoader,
            ],
        };
    }

    static forRootAsync(moduleConfig: ModuleConfig): DynamicModule {
        const { imports = [], inject = [], useFactory } = moduleConfig;
        return {
            module: MongoDataLoaderModule,
            imports,
            providers: [
                {
                    provide: PROVIDERS.CONFIG,
                    useFactory,
                    inject,
                },
                DataLoader,
            ],
        };
    }
}
