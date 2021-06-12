import { Injectable } from "@nestjs/common";
import { GenericMessenger } from "src/chatbot/helpers";

@Injectable()
export class TaskLogin {
    public async handle(psid: string) {
        return new GenericMessenger([
            {
                image_url: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png", // TODO: put web default img to here
                title: "Nhấn để đăng nhập",
                default_action: {
                    url: "https://www.google.com/search?q=" + psid
                }
            }
        ])
    }
}