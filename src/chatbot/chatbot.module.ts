import { Logger, Module } from "@nestjs/common";
import { NLPModule } from "src/lib/nlp";
import { MenuModule } from "src/menu";
import { ChatBotController } from "./chatbot.controller";
import { ChatbotService } from "./chatbot.service";
import { ServiceIntegrationModule } from "./integration";
import { PostBackService } from "./service/service.post-back";
import { ReceiveMessageService } from "./service/service.receive-message";
import { SubcriberService } from "./service/service.subscriber";
import { TaskExercise} from "./service/task/TaskExercise";
import { TaskLogin } from "./service/task/TaskLogin";
import { TaskMenu } from "./service/task/TaskMenu";
import { TaskNLP } from "./service/task/taskNLP";
import { TaskTopic } from "./service/task/TaskTopic";
import { TaskUnknow } from "./service/task/TaskUnknow";
import { TaskWelcome } from "./service/task/TaskWelcome";

@Module({
    controllers: [ChatBotController],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("ChatbotModule"),
        },
        ChatbotService, PostBackService, ReceiveMessageService, TaskExercise, TaskLogin, TaskMenu, TaskTopic, TaskWelcome, TaskNLP, SubcriberService, TaskUnknow
    ],
    exports: [Logger],
    imports: [MenuModule, ServiceIntegrationModule, NLPModule]
})
export class ChatbotModule { }
