import { Logger, Module } from "@nestjs/common";
import { ChatHookController } from "./controllers";

@Module({
    controllers: [ChatHookController],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("ChatbotModule"),
        },
    ],
    exports: [Logger],
})
export class ChatbotModule {}
