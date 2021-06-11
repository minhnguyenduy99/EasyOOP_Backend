import { readFileSync } from "fs";
import { Module } from "@nestjs/common";
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
import { AuthFacebookModule } from "./lib/authentication/facebook";
import { GoogleModule } from "./lib/authentication/google";
import { AuthorizationModule } from "./lib/authorization";
import { RoleManagementModule } from "./role-management";
import { AuthenticationModule } from "./lib/authentication";
import { PaginationModule } from "./lib/pagination";
import { TestExaminationModule } from "./test-examination";
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
export class AppModule {}
