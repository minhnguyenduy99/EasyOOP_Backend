import { Logger, Module, OnApplicationBootstrap } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MODULE_KEYS } from "./consts";
import {
    EntityPolicy,
    EntityPolicySchema,
    Principal,
    PrincipalPolicy,
    PrincipalPolicySchema,
    PrincipalSchema,
    Role,
    RoleActionPolicy,
    RoleActionPolicySchema,
    RolePolicy,
    RolePolicySchema,
    RoleSchema,
} from "./models";
import { AuthorizationCoreService, AuthorizationService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: EntityPolicy.name, schema: EntityPolicySchema },
            { name: RolePolicy.name, schema: RolePolicySchema },
            { name: Role.name, schema: RoleSchema },
            { name: PrincipalPolicy.name, schema: PrincipalPolicySchema },
            { name: Principal.name, schema: PrincipalSchema },
            { name: RoleActionPolicy.name, schema: RoleActionPolicySchema },
        ]),
    ],
    providers: [
        {
            provide: MODULE_KEYS.LOGGER,
            useValue: new Logger("Authorization"),
        },
        AuthorizationCoreService,
        AuthorizationService,
    ],
    exports: [
        MongooseModule,
        AuthorizationCoreService,
        AuthorizationService,
        MODULE_KEYS.LOGGER,
    ],
})
export class AuthorizationCoreModule implements OnApplicationBootstrap {
    constructor(private readonly coreService: AuthorizationCoreService) {}

    async onApplicationBootstrap() {
        await this.coreService.clean();
        await this.coreService.sync();
    }
}
