import {
    ClassSerializerInterceptor,
    Controller,
    Get,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import { MenuService } from "./menu.service";

@Controller("/menus")
@UseInterceptors(ClassSerializerInterceptor)
export class MenuController {
    constructor(private menuService: MenuService) {}

    @Get()
    async getMenu(@Query("id") menuId?: string) {
        const result = await this.menuService.getMenu(
            menuId === "" ? null : menuId,
        );
        return result;
    }
}
