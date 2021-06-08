import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthenticationModule } from "src/lib/authentication";
import { AuthorizationModule } from "src/lib/authorization";
import { RoleEventsHandler } from "./events";
import {
    Creator,
    CreatorSchema,
    Manager,
    ManagerSchema,
    RoleConfig,
    RoleConfigSchema,
} from "./models";
import { CreatorService, ManagerService, RoleServiceHelper } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Creator.name, schema: CreatorSchema },
            { name: Manager.name, schema: ManagerSchema },
            { name: RoleConfig.name, schema: RoleConfigSchema },
        ]),
        EventEmitterModule,
        AuthenticationModule,
        AuthorizationModule.forFeature({}),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("RoleManagement"),
        },
        RoleServiceHelper,
        CreatorService,
        ManagerService,
        RoleEventsHandler,
    ],
    exports: [
        MongooseModule,
        AuthenticationModule,
        CreatorService,
        ManagerService,
    ],
})
export class RoleManagementCoreModule {}
