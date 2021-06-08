import { Inject, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RoleManagementCoreModule, ROLES } from "../core";
import { RoleAuthenticationService } from "./service";
import { configLoader, CONFIG_KEYS } from "./config";
import {
    AuthorizationModule,
    AuthorizationService,
} from "src/lib/authorization";
import { CoreAuthenticationConfig } from "./interfaces";
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
        }),
        RoleManagementCoreModule,
        AuthorizationModule.forFeature({}),
    ],
    providers: [
        {
            provide: CONFIG_KEYS.MODULE_CONFIG,
            useFactory: (configService: ConfigService) => {
                return configService.get(CONFIG_KEYS.MODULE_CONFIG);
            },
            inject: [ConfigService],
        },
        RoleAuthenticationService,
    ],
    exports: [RoleAuthenticationService],
})
export class RoleAuthenticationModule implements OnModuleInit {
    constructor(
        private authService: AuthorizationService,
        @Inject(CONFIG_KEYS.MODULE_CONFIG)
        private config: CoreAuthenticationConfig,
    ) {}

    async onModuleInit() {
        const { rootRoleID } = this.config;
        await this.authService.createPrincipal({
            principal_id: rootRoleID,
            role_name: ROLES.admin,
            self_added: true,
        });
    }
}
