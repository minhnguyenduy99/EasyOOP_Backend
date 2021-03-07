import {
    DynamicModule,
    Inject,
    Module,
    OnModuleInit,
    Optional,
} from "@nestjs/common";
import { v2 as cloudinaryV2 } from "cloudinary";
import { CloudinaryService } from "./cloudinary.service";
import { CLOUDINARY_CONFIG_TOKEN, CLOUDINARY_MODULE_CONFIG } from "./consts";
import {
    CloudinaryConfig,
    CloudinaryFeatureModuleAsyncOption,
    CloudinaryFeatureModuleOption,
    CloudinaryModuleAsyncOption,
    CloudinaryModuleConfig,
    CloudinaryModuleOption,
} from "./interfaces";

@Module({})
export class CloudinaryModule implements OnModuleInit {
    constructor(
        @Inject(CLOUDINARY_CONFIG_TOKEN)
        @Optional()
        private config: string | CloudinaryConfig,
    ) {}

    onModuleInit() {
        if (!this.config) {
            return;
        }
        cloudinaryV2.config(this.config);
    }

    static forRoot(options: CloudinaryModuleOption): DynamicModule {
        const { connectionUri } = options;
        return {
            module: CloudinaryModule,
            global: true,
            providers: [
                {
                    provide: CLOUDINARY_CONFIG_TOKEN,
                    useValue: connectionUri,
                },
            ],
        };
    }

    static forRootAsync(options: CloudinaryModuleAsyncOption): DynamicModule {
        const { imports, useFactory, inject } = options;
        return {
            module: CloudinaryModule,
            global: true,
            imports,
            providers: [
                {
                    provide: CLOUDINARY_CONFIG_TOKEN,
                    useFactory,
                    inject,
                },
            ],
        };
    }

    static forFeature(options: CloudinaryFeatureModuleOption): DynamicModule {
        const { folder } = options;
        const moduleOption = {
            folder,
        } as CloudinaryModuleConfig;
        return {
            module: CloudinaryModule,
            providers: [
                {
                    provide: CLOUDINARY_MODULE_CONFIG,
                    useValue: moduleOption,
                },
                CloudinaryService,
            ],
            exports: [CloudinaryService],
        };
    }

    static forFeatureAsync(
        options: CloudinaryFeatureModuleAsyncOption,
    ): DynamicModule {
        const { imports, inject, useFactory } = options;
        return {
            module: CloudinaryModule,
            imports,
            providers: [
                {
                    provide: CLOUDINARY_MODULE_CONFIG,
                    useFactory,
                    inject,
                },
                CloudinaryService,
            ],
            exports: [CloudinaryService],
        };
    }
}
