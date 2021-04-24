import { readFileSync } from "fs";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfigService } from "./app-config.service";
import { AppConfig } from "./app.config";
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
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ".development.env",
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
            useFactory: (appEnvConfig: AppConfigService) => {
                const path =
                    appEnvConfig.configDir() + "/cloudinary.config.json";
                const config = JSON.parse(
                    readFileSync(path, { encoding: "utf-8" }),
                );
                return config;
            },
            inject: [APP_ENV_CONFIG],
        }),
        ChatbotModule,
        PostModule,
        Q8AModule,
        MenuModule,
        AuthFacebookModule,
        GoogleModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppConfigService],
})
export class AppModule {}
