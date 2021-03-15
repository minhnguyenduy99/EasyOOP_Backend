import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MenuController } from "./menu.controller";
import { Menu, MenuSchema } from "./menu.model";
import { MenuService } from "./menu.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Menu.name, schema: MenuSchema }]),
    ],
    providers: [MenuService],
    exports: [MenuService],
    controllers: [MenuController],
})
export class MenuModule {}
