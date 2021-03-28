import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TagController } from "./tag.controller";
import { Tag, TagSchema } from "./tag.model";
import { TagService } from "./tag.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    ],
    providers: [TagService],
    exports: [MongooseModule, TagService],
    controllers: [TagController],
})
export class TagModule {}
