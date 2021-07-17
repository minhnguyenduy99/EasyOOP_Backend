import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MenuModule } from "src/menu";
import { PostModule } from "src/post";
import { Q8AModule } from "src/q8a";
import { IntegrationService } from "./service";
import { configLoader } from "./config";

@Module({
    imports: [
        PostModule,
        Q8AModule,
        MenuModule,
        ConfigModule.forRoot({
            load: [configLoader],
        }),
    ],
    providers: [IntegrationService],
    exports: [IntegrationService],
})
export class ServiceIntegrationModule {}
