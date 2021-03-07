import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { APP_CONFIG_KEY } from "./app.config";
import { IAppConfig, IAppEnvironmentConfig } from "./lib/app-config";

@Injectable()
export class AppConfigService implements IAppConfig, IAppEnvironmentConfig {
    protected protocol: string;

    constructor(private readonly configService: ConfigService) {
        this.protocol = this.isHTTPS ? "https" : "http";
    }

    configDir(): string {
        return `${this.rootDir()}/config`;
    }

    isHTTPS() {
        return this.configService.get(APP_CONFIG_KEY.HTTPS) === true;
    }

    serverDomain() {
        return `${this.protocol}://${this.host}:${this.port}`;
    }

    publicURL() {
        return `${this.serverDomain}/${this.publicFolder}`;
    }

    host() {
        return this.configService.get(APP_CONFIG_KEY.HOST);
    }

    port() {
        return this.configService.get(APP_CONFIG_KEY.PORT);
    }

    rootDir() {
        return this.configService.get(APP_CONFIG_KEY.ROOT_DIR);
    }

    get publicFolder() {
        return this.configService.get(APP_CONFIG_KEY.PUBLIC_FOLDER);
    }
}
