import { Module, Logger } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryModule } from "src/lib/cloudinary";
import {
    Topic,
    TopicSchema,
    Post,
    PostSchema,
    PostMetadata,
    PostMetadataSchema,
} from "./models";
import { PostCoreService, PostMetadataService } from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Topic.name, schema: TopicSchema },
            { name: Post.name, schema: PostSchema },
            { name: PostMetadata.name, schema: PostMetadataSchema },
        ]),
        CloudinaryModule.forFeature({
            folder: "POSTS",
        }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("PostCoreModule"),
        },
        PostCoreService,
        PostMetadataService,
    ],
    exports: [MongooseModule, CloudinaryModule, PostCoreService],
})
export class CoreModule {}
