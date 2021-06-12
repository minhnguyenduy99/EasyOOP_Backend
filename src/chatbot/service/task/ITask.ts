import { ResponseMessenger } from "src/chatbot/helpers/mesenger-packer";

export interface ITask {
    handlerAny(content: string, ...args: any[]): Promise<ResponseMessenger>
}