import { DynamicModule, Module } from "@nestjs/common";
import { AuthController, UserController } from "./controllers";
import { AuthenticationCoreModule } from "./core";
import { AuthFacebookModule } from "./facebook";
import { GoogleModule } from "./google";

const AUTH_MODULE_MAPPERS = {
    facebook: AuthFacebookModule,
    google: GoogleModule,
};

type AuthType = "facebook" | "google";

@Module({
    imports: [AuthenticationCoreModule],
    exports: [AuthenticationCoreModule],
})
export class AuthenticationModule {
    static modules = {};

    static forRoot(): DynamicModule {
        const modules = Object.values(AuthenticationModule.modules) as any[];
        return {
            module: AuthenticationModule,
            imports: modules,
            providers: [
                {
                    provide: "AUTH_MODULE_TYPE",
                    useValue: "ROOT",
                },
            ],
            controllers: [AuthController, UserController],
        };
    }

    static useAuthentication(name?: AuthType) {
        AuthenticationModule.modules[name] = AUTH_MODULE_MAPPERS[name];
        return AuthenticationModule;
    }
}
