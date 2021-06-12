import { Injectable } from "@nestjs/common";
import { ResponseMessenger, SimpleText } from "src/chatbot/helpers/mesenger-packer";
import { ITask } from "./ITask";

@Injectable()
export class TaskUnknow implements ITask {
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger> {
        return this.handler()
    }
    async handler() {
        return new SimpleText({
            text: "Xin lỗi, dữ liệu của chúng tôi không có thông tin về vấn dề này, xin thứ lỗi"
        })
    }
}