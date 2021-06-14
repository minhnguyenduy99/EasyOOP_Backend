import { Module } from "@nestjs/common";
import { RoleManagementCoreModule } from "../core";
import { RoleAuthenticationService } from "./service";
import { AuthorizationModule } from "src/lib/authorization";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { loader, CONFIG_KEYS } from "./config";

@Module({
    imports: [
        RoleManagementCoreModule,
        AuthorizationModule.forFeature({}),
        ConfigModule.forRoot({
            load: [loader],
        }),
    ],
    providers: [
        RoleAuthenticationService,
        {
            provide: CONFIG_KEYS.ADMIN_ROLE_ID,
            useFactory: (configService: ConfigService) => {
                return configService.get(CONFIG_KEYS.ADMIN_ROLE_ID);
            },
            inject: [ConfigService],
        },
    ],
    exports: [RoleAuthenticationService],
})
export class RoleAuthenticationModule {}
