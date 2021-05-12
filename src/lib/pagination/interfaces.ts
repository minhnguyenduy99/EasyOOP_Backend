import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface AsyncForRootOptions extends Pick<ModuleMetadata, "imports"> {
    useFactory: (...args: any[]) => PaginationConfig;
    inject?: any[];
}

export interface PaginationConfig {
    baseURL?: string;
}
