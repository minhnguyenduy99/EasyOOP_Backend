import { Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaginationModule } from "src/lib/pagination";
import { TagController } from "./tag.controller";
import { Tag, TagSchema } from "./tag.model";
import { TagService } from "./tag.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
        PaginationModule,
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("TagModule"),
        },
        TagService,
    ],
    exports: [MongooseModule, TagService],
    controllers: [TagController],
})
export class TagModule {}
