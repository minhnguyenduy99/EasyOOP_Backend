import { ModuleMetadata } from "@nestjs/common";

export interface SendMailOptions {
    toEmail: string;
    subject: string;
    content: string;
}

export interface MailServiceConfig {
    hostAddress: string;
    requestUrl: string;
}

export interface ForFeatureOptions extends Pick<ModuleMetadata, "imports"> {
    inject: any[];
    useFactory: (
        ...args: any[]
    ) => MailServiceConfig | Promise<MailServiceConfig>;
}
