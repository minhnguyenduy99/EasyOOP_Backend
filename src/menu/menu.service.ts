import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MenuDTO } from "./menu.dto";
import { Menu } from "./menu.model";

export interface IMenuService {
    getMenu(rootMenuId?: string): Promise<MenuDTO>;
}

@Injectable()
export class MenuService {
    constructor(@InjectModel(Menu.name) private menuModel: Model<Menu>) {}

    async getMenu(rootMenuId?: string) {
        const rootMenu = rootMenuId ?? null;
        const [currentMenu, childrenMenu] = await Promise.all([
            rootMenu
                ? this.menuModel.findById(rootMenu)
                : Promise.resolve(null),
            this.menuModel.find({
                parent_menu: rootMenu,
            }),
        ]);

        console.log(childrenMenu);

        return new MenuDTO(
            currentMenu?.toObject(),
            childrenMenu.map((menu) => new MenuDTO(menu.toObject())),
        );
    }

    async getMenusByTag(tagId: string) {
        const menu = await this.menuModel.findOne({
            tag_id: tagId,
        });
        if (!menu) {
            return null;
        }
        const childrenMenu = await this.menuModel.find({
            parent_menu: menu._id,
        });
        return new MenuDTO(
            menu?.toObject(),
            childrenMenu.map((menu) => new MenuDTO(menu.toObject())),
        );
    }
}
