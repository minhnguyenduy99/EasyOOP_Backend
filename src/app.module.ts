import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfigService } from "./app-config.service";
import { AppConfig, APP_CONFIG_KEY } from "./app.config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatbotModule } from "./chatbot";
import { AppConfigModule, APP_ENV_CONFIG } from "./lib/app-config";
import { CloudinaryModule } from "./lib/cloudinary";
import { MongoIdGeneratorModule } from "./lib/database/mongo";
import { PostModule } from "./post";
import { Q8AModule } from "./q8a";
import { MenuModule } from "./menu";
import { AuthorizationModule, AuthorizationService } from "./lib/authorization";
import {
    RoleAuthenticationService,
    RoleManagementModule,
} from "./role-management";
import { AuthenticationModule, RootAuthService } from "./lib/authentication";
import { PaginationModule } from "./lib/pagination";
import { TestExaminationModule } from "./test-examination";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".development.test.env",
            load: [AppConfig],
        }),
        AppConfigModule.forRoot({
            appConfigClass: AppConfigService,
            appEnvConfigClass: AppConfigService,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "client"),
        }),
        EventEmitterModule.forRoot({
            delimiter: ".",
        }),
        MongooseModule.forRoot(process.env.MONGO_DATABASE_URI),
        MongoIdGeneratorModule,
        CloudinaryModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const config = configService.get(
                    APP_CONFIG_KEY.CLOUDINARY_CONFIG,
                );
                return config;
            },
            inject: [ConfigService],
        }),
        AuthorizationModule.forRoot({
            roles: ["creator", "manager", "viewer", "admin"],
        }),
        // RoleManagementModule,
        ChatbotModule,
        PostModule,
        Q8AModule,
        MenuModule,
        AuthenticationModule.useAuthentication("facebook")
            .useAuthentication("google")
            .forRoot(),
        RoleManagementModule,
        PaginationModule.forRootAsync({
            useFactory: (appEnvConfig: AppConfigService) => {
                return {
                    baseURL: appEnvConfig.serverDomain(),
                };
            },
            inject: [APP_ENV_CONFIG],
        }),
        TestExaminationModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppConfigService],
})
export class AppModule implements OnApplicationBootstrap {
    constructor(
        private authorizeService: AuthorizationService,
        private rootUserService: RootAuthService,
        private configService: ConfigService,
    ) {}

    async onApplicationBootstrap() {
        const adminUser = this.configService.get(
            APP_CONFIG_KEY.APP_ADMIN_CONFIG,
        );
        await Promise.all([
            this.rootUserService.createRootUser(adminUser),
            this.authorizeService.createPrincipal({
                principal_id: adminUser.role_id,
                role_name: "admin",
                self_added: true,
            }),
        ]);
    }
}
