import { AttachmentElement, QuickRepliesMessengerDTO } from "src/chatbot/dto";
import { CacheService, GenericMessenger, QuickRepliesMessenger, SimpleText } from "src/chatbot/helpers";
import { AnswerDTO } from "src/chatbot/integration/dto";
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

        NLP.topic.getClassifications(this.body, askThreshold).then(topics => {
            if ((topics.length > 0 && topics[0].value >= trustThreshold) || topics.length == 1) {
                this.handlerTrusted(topics[0].label, this.type)
                return
            }
            this.handlerUntrusted(topics)
        })
    }

    private handlerTrusted(topic: string, type: string) {
        if (type == "definition")
            type = "question"
        else if (type == "example")
            type = "post"
        this.Log.debug({ type: type, value: topic });


        CacheService.integrationService.getResultByTag({ type: type, value: topic }).then((ret) => {
            if (ret.length == 0)
                this.msg.reply(new SimpleText({ text: `Xin lỗi, bạn hỏi khó quá, thử cái khác đi` }))
            else if (ret.length == 1 && ret[0].url == null)
                this.msg.reply(new SimpleText({ text: ret[0].text }))
            else {
                let rep = [] as AttachmentElement[]
                ret.forEach(e => {
                    let p = {
                        title: e.title || this.msg.text,
                        subtitle: e.text
                    } as AttachmentElement
                    if (e.image) {
                        p.image_url = e.image
                        if (e.url)
                            p.default_action = {
                                url: e.url,
                                webview_height_ratio: "FULL"
                            }
                    }
                    rep.push(p);
                })
                this.msg.reply(new GenericMessenger(rep))
            }
        })
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