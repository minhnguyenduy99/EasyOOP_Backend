import { SimpleText } from "src/chatbot/helpers";
import { BaseMessageHandler } from "..";

export class TaskWelcome extends BaseMessageHandler {
    handler() {
        this.msg.reply(new SimpleText({
            text: `Xin chào, đây là chatbot hỗ trợ học OOP
bạn có thể hỏi bất cứ điều gì liên quan đến OOP ở đây bao gồm khái niệm, ví dụ, bài tập, ...`}))
    }
}