import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CoreModule } from "../core";
import { PostVerificationEvents } from "./events";
import { PostVerificaionSchema, PostVerification } from "./models";
import { PostVerificationService, VerificationHelper } from "./services";

@Module({
    imports: [
        CoreModule,
        MongooseModule.forFeature([
            { name: PostVerification.name, schema: PostVerificaionSchema },
        ]),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("PostVerification"),
        },
        PostVerificationService,
        VerificationHelper,
        PostVerificationEvents,
    ],
    exports: [PostVerificationService],
})
export class PostVerificationModule {}
