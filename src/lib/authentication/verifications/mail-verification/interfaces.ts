import { FactoryProvider, ModuleMetadata } from "@nestjs/common";

export interface MailServiceConfigOptions {
    endpoint?: string;
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
    mailConfigProvider: ConfigProvider<MailServiceConfigOptions>;
}
