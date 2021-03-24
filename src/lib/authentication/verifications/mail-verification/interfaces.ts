import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface TransporterConfig {
    host?: string;
    port?: number;
    secure?: boolean;
    auth: {
        user?: string;
        pass?: string;
    };
}

export interface MailServiceConfig {
    hostAddress?: string;
    defaultSubject?: string;
    htmlFormatter?: IHTMLFormatter<any>;
}

export interface IHTMLFormatter<Data> {
    format(data: Data): string | Promise<string>;
}

interface ConfigProvider<Config>
    extends Partial<Pick<FactoryProvider, "inject">> {
    useFactory(...args: any[]): Config | Promise<Config>;
}

export interface ForRootModuleOptions extends Pick<ModuleMetadata, "imports"> {
    mailConfigProvider: ConfigProvider<MailServiceConfig>;
    transportConfigProvider: ConfigProvider<TransporterConfig>;
}
