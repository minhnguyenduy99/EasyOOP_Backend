import { Injectable, Logger } from "@nestjs/common";
import { post } from "request";
import Lang from "./Lang";
import { TaskID } from "./taskID";

@Injectable()
export class TaskGreeting {
    constructor(
        private readonly Log: Logger,
    ) { }

    async handler(psid: string) {
        let menu = [
            {
                call_to_actions: [
                    { title: Lang.get(Lang.txt_menu_myweb), url: process.env.WEB_SITE },
                    { title: Lang.get(Lang.txt_menu_QnA), payload: { tid: TaskID.QnA } },
                    { title: Lang.get(Lang.txt_menu_root), payload: { tid: TaskID.Menu } },
                    { title: Lang.get(Lang.txt_about), payload: { tid: TaskID.About } }
                ]
            }
        ] as IPersistentMenu[]

        for (let i = 0, len = menu.length; i < len; i++) {
            let e = menu[i]
            e.locale = e.locale || "default"
            e.composer_input_disabled = e.composer_input_disabled || false
            for (let j = e.call_to_actions.length - 1; j >= 0; j--) {
                if (!this.fixActions(e.call_to_actions[j]))
                    e.call_to_actions.slice(j, 1)
            }
        }
        post(
            {
                uri: process.env.FACEBOOK_HOOK_USER_SETTINGS,
                qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
                json: {
                    psid: psid,
                    persistent_menu: menu
                }
            },
            (err, res, body) => err && this.Log.error(err, err.trace)
        )
    }

    private fixActions(action: IPersistentMenuAction) {
        if (action.url) {
            action.type = "web_url"
            action.webview_height_ratio = action.webview_height_ratio || "FULL"
        }
        else if (action.payload) {
            action.type = "postback"
            if (typeof action.payload !== "string")
                action.payload = JSON.stringify(action.payload)
        } else
            return false
        return action
    }
}

interface IPersistentMenu {
    locale?: string
    composer_input_disabled?: boolean,
    call_to_actions: IPersistentMenuAction[]
}

interface IPersistentMenuAction {
    type?: "postback" | "web_url"
    title: string
    url?: string
    payload?: any
    webview_height_ratio?: "COMPACT" | "TALL" | "FULL"
}