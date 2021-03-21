import { Logger, Module } from "@nestjs/common";
import { MenuModule } from "src/menu";
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
    imports: [MenuModule]
})
export class ChatbotModule {}
