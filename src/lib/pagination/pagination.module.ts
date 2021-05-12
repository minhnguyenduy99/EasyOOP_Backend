import { DynamicModule, Module } from "@nestjs/common";
import { PAGINATION_CONFIG_PROVIDER } from "./consts";
import { AsyncForRootOptions, PaginationConfig } from "./interfaces";
import PaginatorFactory from "./pagination.factory";
@Module({
    providers: [PaginatorFactory],
    exports: [PaginatorFactory],
})
export default class PaginationModule {
    static forRoot(options: PaginationConfig): DynamicModule {
        return {
            module: PaginationModule,
            global: true,
            providers: [
                {
                    provide: PAGINATION_CONFIG_PROVIDER,
                    useValue: options,
                },
            ],
        };
    }

    static forRootAsync(options: AsyncForRootOptions): DynamicModule {
        const { imports, useFactory, inject } = options;
        return {
            module: PaginationModule,
            global: true,
            imports,
            providers: [
                {
                    provide: PAGINATION_CONFIG_PROVIDER,
                    useFactory,
                    inject,
                },
            ],
        };
    }

    // static forFeature(): DynamicModule {
    //     return {
    //         module: PaginationModule,
    //         providers: [
    //             {
    //                 provide: PAGINATION_CONFIG_PROVIDER,
    //                 useFactory: (config: PaginationConfig) {
    //                     return config;
    //                 },
    //                 inject: [PAGINATION_CONFIG_PROVIDER],
    //             }
    //         ]
    //     }
    // }
}
