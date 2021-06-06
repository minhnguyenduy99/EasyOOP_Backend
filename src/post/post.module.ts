import { Logger, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { PaginationModule } from "src/lib/pagination";
import { CloudinaryModule } from "src/lib/cloudinary";
import { TagModule } from "src/tag";
import { CoreModule } from "./modules/core";
import {
    PostController,
    TopicController,
    PostVerificationController,
    CreatorPostController,
    CreatorVerificationController,
    CreatorTopicController,
} from "./controllers";
import { BaseLimiter, PostServiceExtender } from "./helpers";
import { PostService, TopicService } from "./services";
import { PostVerificationModule } from "./modules/post-verification";
import { AuthorizationModule } from "src/lib/authorization";
import authorizationConfig from "./authorization.config";
import { AuthenticationModule } from "src/lib/authentication";
@Module({
    imports: [
        CoreModule,
        PostVerificationModule,
        PaginationModule,
        EventEmitterModule,
        AuthenticationModule,
        CloudinaryModule.forFeature({
            folder: "POSTS",
        }),
        TagModule,
        AuthorizationModule.forFeature({ config: authorizationConfig }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("PostModule"),
        },
        PostServiceExtender,
        BaseLimiter,
        TopicService,
        PostService,
    ],
    controllers: [
        TopicController,
        PostController,
        CreatorPostController,
        CreatorVerificationController,
        PostVerificationController,
        CreatorTopicController,
    ],
    exports: [TopicService, PostService],
})
export class PostModule {}
