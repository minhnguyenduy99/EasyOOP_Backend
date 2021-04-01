import { Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthenticationCoreModule } from "../core";
import { PROVIDERS } from "./consts";
import { ConfigLoader, CONFIG_KEYS } from "./google.config";
import { GoogleController } from "./google.controller";
import { GoogleUserService } from "./google.service";
import { GoogleStrategy } from "./google.strategy";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ConfigLoader],
        }),
        AuthenticationCoreModule.forFeature({
            useVerification: false,
        }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("GoogleAuthModule"),
        },
        {
            provide: PROVIDERS.GOOGLE_APP_CONFIG,
            useFactory: (config: ConfigService) => {
                return config.get(CONFIG_KEYS.GOOGLE_APP_CONFIG);
            },
            inject: [ConfigService],
        },
        GoogleStrategy,
        GoogleUserService,
    ],
    controllers: [GoogleController],
})
export class GoogleModule {}
