import { Injectable } from "@nestjs/common";
import { SimpleText } from "src/chatbot/helpers/mesenger-packer";

@Injectable()
export class TaskWelcome {
    async handler() {
        return new SimpleText({
            text: "Xin chào, đây là chatbot hỗ trợ học OOP\nbạn có thể hỏi bất cứ điều gì liên quan đến OOP ở đây bao gồm khái niệm, ví dụ, bài tập, ..."
        })
    }
}