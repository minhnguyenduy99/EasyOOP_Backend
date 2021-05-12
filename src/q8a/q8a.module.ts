import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthenticationModule } from "src/lib/authentication";
import { AuthorizationModule } from "src/lib/authorization";
import { PaginationModule } from "src/lib/pagination";
import { TagModule } from "src/tag";
import { Q8AController } from "./controllers";
import { Q8AModel, Q8ASchema } from "./models";
import { Q8AService, Q8AServiceHelper } from "./services";
import authorizationConfig from "./authorization.config";
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Q8AModel.name, schema: Q8ASchema }]),
        PaginationModule,
        TagModule,
        AuthenticationModule,
        AuthorizationModule.forFeature({ config: authorizationConfig }),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("Q&AModule"),
        },
        Q8AService,
        Q8AServiceHelper,
    ],
    exports: [Q8AService],
    controllers: [Q8AController],
})
export class Q8AModule {}
