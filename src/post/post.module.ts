import { Logger, Module } from "@nestjs/common";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryModule } from "src/lib/cloudinary";
import { PaginationModule } from "src/lib/pagination";
import {
    PostController,
    TopicController,
    AdminPostController,
} from "./controllers";
import { BaseLimiter, PostServiceExtender } from "./helpers";
import {
    Post,
    PostMetadata,
    PostMetadataSchema,
    PostSchema,
    Topic,
    TopicSchema,
} from "./models";
import { PostService, TopicService } from "./services";
import { PostMetadataService } from "./services/post-metadata.service";
import { PostEvents } from "./events";
import { TagModule } from "src/tag";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: Post.name, schema: PostSchema },
            { name: PostMetadata.name, schema: PostMetadataSchema },
        ]),
        PaginationModule,
        CloudinaryModule.forFeature({
            folder: "POSTS",
        }),
        EventEmitterModule,
        TagModule,
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("PostModule"),
        },
        TopicService,
        PostService,
        PostMetadataService,
        PostServiceExtender,
        BaseLimiter,
        PostEvents,
    ],
    controllers: [TopicController, PostController, AdminPostController],
    exports: [TopicService, PostService],
})
export class PostModule {}
