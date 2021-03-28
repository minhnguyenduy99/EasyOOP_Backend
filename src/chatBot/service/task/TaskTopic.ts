import { QuickRepliesMessengerDTO } from "src/chatbot/dto";
import { QuickRepliesMessenger, SimpleText } from "src/chatbot/helpers";
import { NLP, Label } from "src/lib/nlp";
import { BaseMessageHandler } from "..";

const trustThreshold = process.env.TRUST_THRESHOLD ? Number.parseFloat(process.env.TRUST_THRESHOLD) : 0.7
const askThreshold = process.env.ASK_THRESHOLD ? Number.parseFloat(process.env.ASK_THRESHOLD) : 0.3

export class TaskTopic extends BaseMessageHandler {
    public constructor(msg, body, private type?: string) {
        super(msg, body)
    }

    handler() {
        if (this.type == null) {
            this.handlerTrusted(this.body.topic, this.body.type)
            return
        }

        let topics = NLP.topic.getClassifications(this.body, askThreshold)
        if ((topics.length > 0 && topics[0].value >= trustThreshold) || topics.length == 1) {
            this.handlerTrusted(topics[0].label, this.type)
            return
        }

        this.handlerUntrusted(topics)
    }

    private handlerTrusted(topic, type) {
        this.msg.reply(new SimpleText({ text: `request topic: ${topic}, type: ${type}` }))
    }

    private handlerUntrusted(topics) {
        let data = {
            text: `Xin lỗi, tôi không rõ bạn muốn ${this.type2text()} về vấn đề nào, vui lòng xác nhận dưới đây`,
            buttons: []
        } as QuickRepliesMessengerDTO
        topics.forEach(e => {
            data.buttons.push({
                title: e.label,
                payload: { topic: { type: this.type, topic: e.label } }
            })
        })
        this.msg.reply(new QuickRepliesMessenger(data))
    }

    private type2text(): string {
        switch (this.type) {
            case Label.type.definition:
                return "hỏi định nghĩa"
            case Label.type.example:
                return "lấy ví dụ"
            case Label.type.exercise:
                "làm bài tập"
            default:
                return ""
        }
    }
}