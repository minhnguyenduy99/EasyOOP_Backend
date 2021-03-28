import { DynamicModule, Module, Logger } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthUser, AuthUserSchema, Verifier, VerifierSchema } from "./models";
import { ForFeatureOptions } from "./core.interfaces";
import { AuthenticationService, UserVerifier } from "./services";
import { EncryptModule } from "src/lib/encrypt";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CONFIG_KEYS } from "./core.config";
import { TokenConfig } from "./interfaces";
import { PROVIDER } from "./consts";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [],
        }),
        JwtModule.register({}),
        EncryptModule,
        MongooseModule.forFeature([
            { name: AuthUser.name, schema: AuthUserSchema },
            { name: Verifier.name, schema: VerifierSchema },
        ]),
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
    ],
    exports: [MongooseModule, EncryptModule, AuthenticationService],
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
