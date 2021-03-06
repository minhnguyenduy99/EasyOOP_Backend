import { Injectable } from "@nestjs/common";
import { QuickRepliesMessengerDTO } from "src/chatbot";
import { QuickRepliesMessenger, ResponseMessenger } from "src/chatbot/helpers";
import { MenuService } from "src/menu/menu.service";
import { ITask } from "./ITask";
import { TaskID } from "./taskID";

@Injectable()
export class TaskMenu implements ITask {
    constructor(
        protected readonly menuService: MenuService
    ) { }
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.handler.apply(this, args)
    }

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