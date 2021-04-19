import { Injectable } from "@nestjs/common";
import { SimpleText } from "src/chatbot/helpers/mesenger-packer";

@Injectable()
export class TaskUnknow {
    async handler() {
        return new SimpleText({
            text: "Xin lỗi, dữ liệu của chúng tôi không có thông tin về vấn dề này, xin thứ lỗi"
        })
    }
}