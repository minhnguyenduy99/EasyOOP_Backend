import { Logger, Module } from "@nestjs/common";
import { NLPModule } from "src/lib/nlp";
import { MenuModule } from "src/menu";
import { ChatHookController } from "./controllers";
import { ServiceIntegrationModule } from "./integration";

@Module({
    controllers: [ChatHookController],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("ChatbotModule"),
        },
    ],
    exports: [Logger],
    imports: [MenuModule, ServiceIntegrationModule, NLPModule]
})
export class ChatbotModule {}
