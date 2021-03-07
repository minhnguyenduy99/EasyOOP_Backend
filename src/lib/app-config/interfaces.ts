import { Type } from "@nestjs/common";
import { IAppConfig } from "./app-config.service";
import { IAppEnvironmentConfig } from "./app-env-config.service";

export interface AppConfigModuleOptions {
    appConfigClass?: Type<IAppConfig>;
    appEnvConfigClass?: Type<IAppEnvironmentConfig>;
}
