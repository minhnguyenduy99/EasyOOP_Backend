import { Injectable, Logger } from "@nestjs/common";
import { AttachmentElement, QuickRepliesMessengerDTO } from "src/chatbot";
import { GenericMessenger, QuickRepliesMessenger, SimpleText } from "src/chatbot/helpers";
import { TaskID } from "./taskID";
import { TaskLogin } from "./TaskLogin";

@Injectable()
export class TaskExercise {
    private readonly logTag = "[TaskExercise]"
    private readonly pageNum = 5
    private static readonly markChoise = ["🔴", "🔵", "🟡", "🟢", "🟤", "🟣", "🟠", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    constructor(
        private readonly Log: Logger,
        private readonly taskLogin: TaskLogin
    ) { }

    public async searchTest(psid: string, topic: string) {
        let isLogin = true
        if (!isLogin)
            return this.taskLogin.handle(psid)
        else {
            let dto = [
                {
                    title: "đề 1",
                    subtitle: "Test về oop",
                    test_id: "ID 1"
                }
            ];
            let data = [] as AttachmentElement[]
            dto.forEach(e => {
                let push = {
                    title: e.title
                } as AttachmentElement
                if (e.subtitle != null)
                    push.subtitle = e.subtitle
                push.buttons = [
                    {
                        title: "Làm ngay",
                        payload: {
                            tid: TaskID.Test,
                            args: [e.test_id]
                        }
                    }
                ]
                data.push(push)
            });

            return new GenericMessenger(data);
        }
    }

    public async startTest(test_id: string) {
        let time = "90 phút"
        let num = 16
        return new SimpleText({
            text: `Đề thi có ${num} câu hỏi, trả lời bằng cách chọn đáp án tương ứng dưới mỗi câu hỏi\nBạn có ${time} để làm bài, thời gian bắt đầu tính khi bạn đọc đề câu hỏi đầu tiên`,
        }, this.onChoosePage.bind(this), test_id, 0, num)
    }

    private async _onChoosePage(test_id: string, page: number, total: number) {
        let data = {
            text: "Mời chọn câu hỏi",
            buttons: []
        } as QuickRepliesMessengerDTO
        if (page > 0)
            data.buttons.push({
                title: "<",
                payload: {
                    tid: TaskID.ExerciseChoosePage,
                    args: [test_id, page - 1, total]
                }
            })
        let start = this.pageNum * page
        let end = Math.min(this.pageNum * (page + 1), total)
        for (let i = start; i < end; i++)
            data.buttons.push({
                title: "Câu " + i,
                payload: {
                    tid: TaskID.ExerciseChooseQuestion,
                    args: [test_id, i],
                }
            })
        if (end < total)
            data.buttons.push({
                title: ">",
                payload: {
                    tid: TaskID.ExerciseChoosePage,
                    args: [test_id, page + 1, total]
                }
            })
        return new QuickRepliesMessenger(data)
    }
    public async onChoosePage(...args) {
        return this._onChoosePage(args[0], args[1], args[2])
    }

    private async _onChooseQuestion(test_id: string, question: number) {
        let time = "50 phút"
        let content = "đây là nội dung câu hỏi"
        let answer = [
            "câu trả lời 1",
            "câu trả lời 2",
            "câu trả lời 3",
            "câu trả lời 4",
        ]

        let data = {
            text: [
                `Câu hỏi ${question} - Thời gian còn lại ${time}`,
                `${content}`,
                ``
            ],
            buttons: []
        }

        for (let i = 0, len = answer.length; i < len; i++) {
            data.text.push(`${TaskExercise.markChoise[i]} ${answer[i]}`)
            data.buttons.push({
                title: TaskExercise.markChoise[i],
                payload: {
                    tid: TaskID.ExerciseChooseAnswer,
                    args: [test_id, question, i]
                }
            })
        }

        return new QuickRepliesMessenger(data)
    }
    public async onChooseQuestion(...args) {
        return this._onChooseQuestion(args[0], args[1])
    }
}