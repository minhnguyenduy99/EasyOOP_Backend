import { QuickRepliesMessengerDTO } from "src/chatbot/dto";
import { CacheService, QuickRepliesMessenger } from "src/chatbot/helpers";
import { BaseMessageHandler, TaskPostBackMessage } from "..";

export class TaskMenu extends BaseMessageHandler {
    public static readonly prefix = "M"

    handler() {
        if (this.body)
            this.body = this.body.substring(TaskPostBackMessage.prefix.length + TaskMenu.prefix.length)

        CacheService.menuService.getMenu(this.body).then((data) => {
            let rep = {
                text: data.menu_name || "Chọn mục bạn mong muốn",
                buttons: []
            } as QuickRepliesMessengerDTO;
            data.children_menu.forEach(e => rep.buttons.push({
                title: e.menu_name,
                payload: TaskPostBackMessage.prefix + TaskMenu.prefix + e.menu_id
            }))
            // rep.buttons.push({
            //     title: "Quay lại",
            //     payload: data.parent_menu
            // })
            this.msg.reply(new QuickRepliesMessenger(rep))
        })
    }
}