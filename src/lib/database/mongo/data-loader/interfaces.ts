import { ModuleMetadata } from "@nestjs/common";

export interface DataLoaderConfig {
    path: string;
    modelNameHandler?: (path: string) => string;
    cleanFirst?: boolean;
}

export interface ModuleConfig extends Pick<ModuleMetadata, "imports"> {
    inject: any[];
    useFactory: (...args: any[]) => DataLoaderConfig;
}
