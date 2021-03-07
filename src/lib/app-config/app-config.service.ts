export interface IAppConfig {
    host(): string;
    port(): string;
    isHTTPS(): boolean;
    serverDomain(): string;
}
