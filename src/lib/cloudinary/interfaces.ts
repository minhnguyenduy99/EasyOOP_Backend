import { ModuleMetadata } from "@nestjs/common";

export interface CloudinaryModuleAsyncOption
    extends Pick<ModuleMetadata, "imports"> {
    useFactory: (
        ...args: any[]
    ) => CloudinaryConfig | Promise<CloudinaryConfig>;
    inject?: any[];
}

export interface CloudinaryModuleOption {
    connectionUri: string | CloudinaryConfig;
}

export interface CloudinaryConfig {
    cloud_name: string;
    api_key: string;
    api_secret: string;

    // custom key
    rootFolder?: string;
}

export interface CloudinaryFeatureModuleOption {
    folder: string;
}

export interface CloudinaryFeatureModuleAsyncOption
    extends Pick<ModuleMetadata, "imports"> {
    useFactory: (
        ...args: any[]
    ) => CloudinaryModuleConfig | Promise<CloudinaryModuleConfig>;
    inject?: any[];
}

export interface CloudinaryModuleConfig {
    folder: string;
}
