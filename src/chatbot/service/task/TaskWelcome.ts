import { Injectable } from "@nestjs/common";
import { ResponseMessenger, SimpleText } from "src/chatbot/helpers/mesenger-packer";
import { ITask } from "./ITask";

@Injectable()
export class TaskWelcome implements ITask {
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.handler()
    }
    async handler() {
        return new SimpleText({
            text: "Xin chào, đây là chatbot hỗ trợ học OOP\nbạn có thể hỏi bất cứ điều gì liên quan đến OOP ở đây bao gồm khái niệm, ví dụ, bài tập, ..."
        })
    }
}