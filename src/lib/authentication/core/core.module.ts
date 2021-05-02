import { DynamicModule, Module, Logger } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthUser, AuthUserSchema, Verifier, VerifierSchema } from "./models";
import { ForFeatureOptions } from "./core.interfaces";
import {
    AuthenticationService,
    UserVerifier,
    GlobalAuthUserService,
} from "./services";
import { EncryptModule } from "src/lib/encrypt";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "./core.config";
import { TokenConfig } from "./interfaces";
import { PROVIDER } from "./consts";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { AuthorizationModule } from "src/lib/authorization";
import { UserEventsHandler } from "./events/user-events.handler";
import configLoader from "./core.config";
import { AuthTestController } from "./auth-test.controller";
import { AccessTokenStrategy } from "./strategies";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
        }),
        JwtModule.register({}),
        EncryptModule,
        MongooseModule.forFeature([
            { name: AuthUser.name, schema: AuthUserSchema },
            { name: Verifier.name, schema: VerifierSchema },
        ]),
        EventEmitterModule,
        AuthorizationModule.forFeature({}),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("AuthenticationCoreModule"),
        },
        {
            provide: PROVIDER.TOKEN_CONFIG,
            useFactory: (config: ConfigService) => {
                const tokenConfig = config.get(
                    CONFIG_KEYS.TOKEN_CONFIG,
                ) as TokenConfig;
                return tokenConfig;
            },
            inject: [ConfigService],
        },
        AuthenticationService,
        GlobalAuthUserService,
        UserEventsHandler,
        AccessTokenStrategy,
    ],
    exports: [
        MongooseModule,
        EncryptModule,
        EventEmitterModule,
        AuthenticationService,
        GlobalAuthUserService,
    ],
    controllers: [AuthTestController],
})
export class AuthenticationCoreModule {
    static forFeature(options: ForFeatureOptions): DynamicModule {
        const providers = [];
        const exports = [];
        if (options.useVerification) {
            providers.push(UserVerifier);
            exports.push(UserVerifier);
        }
        return {
            module: AuthenticationCoreModule,
            providers,
            exports,
        };
    }
}
