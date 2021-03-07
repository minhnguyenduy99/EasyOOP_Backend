import {
    DynamicModule,
    Inject,
    Module,
    OnModuleInit,
    Optional,
    Provider,
} from "@nestjs/common";
import { ModuleType, MODULE_KEYS } from "./consts";
import {
    AuthCoreRootOptions,
    AuthFeatureConfig,
    AuthFeatureOptions,
    AuthRoleProvider,
} from "./interfaces";
import { AuthorizationCoreModule } from "./authorization-core.module";
import { AuthorizationCoreService } from "./services";

@Module({
    imports: [AuthorizationCoreModule],
    exports: [AuthorizationCoreModule],
})
export class AuthorizationModule implements OnModuleInit {
    constructor(
        @Optional()
        @Inject(MODULE_KEYS.AuthFeatureOptions)
        private readonly config: AuthFeatureConfig,
        @Optional()
        @Inject(MODULE_KEYS.RolesData)
        private readonly roles: Set<string>,
        @Inject(MODULE_KEYS.TYPE) private readonly type: ModuleType,
        private readonly authorizationCoreService: AuthorizationCoreService,
    ) {}

    async onModuleInit() {
        if (this.type === ModuleType.Root) {
            this.authorizationCoreService.setRoles(this.roles as Set<string>);
            return;
        }
        if (!this.config) {
            return;
        }
        const { policies, assigns } = this.config;
        this.authorizationCoreService.addNewEntityPolicies(policies);
        this.authorizationCoreService.assignPoliciesToRole(assigns);
    }

    static forRoot(options: AuthCoreRootOptions): DynamicModule {
        const { roles } = options;
        return {
            module: AuthorizationModule,
            providers: [
                {
                    provide: MODULE_KEYS.TYPE,
                    useValue: ModuleType.Root,
                },
                this.getRoleDataProvider(roles),
            ],
        };
    }

    static forFeature(options?: AuthFeatureOptions): DynamicModule {
        const { config } = options;
        return {
            module: AuthorizationModule,
            providers: [
                {
                    provide: MODULE_KEYS.AuthFeatureOptions,
                    useValue: config,
                },
                {
                    provide: MODULE_KEYS.TYPE,
                    useValue: ModuleType.Feature,
                },
            ],
        };
    }

    private static getRoleDataProvider(
        roles: string[] | AuthRoleProvider,
    ): Provider {
        if ("useFactory" in roles) {
            return {
                provide: MODULE_KEYS.RolesData,
                useFactory: async (...injects: any[]) => {
                    const arrayRoles = await Promise.resolve(
                        Function.call(roles["useFactory"], injects),
                    );
                    const setRoles = new Set(arrayRoles);
                    return setRoles;
                },
                inject: roles["inject"] ?? [],
            };
        }
        return {
            provide: MODULE_KEYS.RolesData,
            useValue: new Set(roles),
        };
    }
}
