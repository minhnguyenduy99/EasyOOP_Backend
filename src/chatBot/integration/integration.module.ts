import { Module } from "@nestjs/common";
import { MenuModule } from "src/menu";
import { PostModule } from "src/post";
import { Q8AModule } from "src/q8a";
import { IntegrationService } from "./service";

@Module({
    imports: [PostModule, Q8AModule, MenuModule],
    providers: [IntegrationService],
    exports: [IntegrationService],
})
export class ServiceIntegrationModule {}
