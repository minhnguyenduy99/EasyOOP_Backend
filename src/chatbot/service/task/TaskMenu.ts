import { Injectable } from "@nestjs/common";
import { QuickRepliesMessengerDTO } from "src/chatbot";
import { QuickRepliesMessenger } from "src/chatbot/helpers";
import { MenuService } from "src/menu/menu.service";
import { TaskID } from "./taskID";

@Injectable()
export class TaskMenu {
    constructor(
        protected readonly menuService: MenuService
    ) { }

    async handler(menuID?: string) {
        const data = await this.menuService.getMenu(menuID)
        let rep = {
            text: data.menu_name || "Chọn mục bạn mong muốn",
            buttons: []
        } as QuickRepliesMessengerDTO
        data.children_menu.forEach(e => rep.buttons.push({
            title: e.menu_name,
            payload: {
                tid: TaskID.Menu,
                args: [e.menu_id],
            }
        }))
        return new QuickRepliesMessenger(rep)
    }
}