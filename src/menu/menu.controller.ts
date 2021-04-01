import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { MenuService } from "./menu.service";

@Controller("/menus")
@UseInterceptors(ClassSerializerInterceptor)
export class MenuController {
    constructor(private menuService: MenuService) {}

    @Get()
    async getMenu(@Query("id") menuId: string) {
        const result = await this.menuService.getMenu(
            menuId === "" ? null : menuId,
        );
        return result;
    }

    @Get("/tag/:tag_id")
    async getMenuByTag(@Param("tag_id") tagId: string) {
        const result = await this.menuService.getMenusByTag(tagId);
        return result;
    }
}
