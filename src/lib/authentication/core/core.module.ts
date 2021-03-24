import { DynamicModule, Module, Logger } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthUser, AuthUserSchema, Verifier, VerifierSchema } from "./models";
import { ForFeatureOptions } from "./core.interfaces";
import { UserVerifier } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: AuthUser.name, schema: AuthUserSchema },
            { name: Verifier.name, schema: VerifierSchema },
        ]),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("AuthenticationCore"),
        },
    ],
    exports: [MongooseModule],
})
export class AuthenticationCore {
    static forFeature(options: ForFeatureOptions): DynamicModule {
        const providers = [];
        const exports = [];
        if (options.useVerification) {
            providers.push(UserVerifier);
            exports.push(UserVerifier);
        }
        return {
            module: AuthenticationCore,
            providers,
            exports,
        };
    }
}
