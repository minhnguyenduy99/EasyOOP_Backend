import { GenericMessenger } from "src/chatbot/helpers";
import { BaseMessageHandler } from "..";


export class TaskHelpMessage extends BaseMessageHandler {
    constructor(msg) {
        super(msg, null)
    }

    handler() {
        this.msg.reply(new GenericMessenger([
            {
                title: "google",
                subtitle: "google.com",
                image_url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
                default_action: {
                    url: "https://google.com.vn",
                    webview_height_ratio: "FULL",
                }
            }
        ]))
    }

}