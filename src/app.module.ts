import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { AppConfigService } from "./app-config.service";
import { AppConfig } from "./app.config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ChatbotModule } from "./chatbot";
import { AppConfigModule } from "./lib/app-config";
import { MongoIdGeneratorModule } from "./lib/database/mongo";
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
        ChatbotModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppConfigService],
})
export class AppModule {}
