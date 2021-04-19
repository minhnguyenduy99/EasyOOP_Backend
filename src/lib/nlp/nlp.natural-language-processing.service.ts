import { Injectable } from "@nestjs/common";
import { VNTK } from "vntk";
import { classifier, constant } from ".";
import { RuleBasedSentenceBoundaryDetection } from "./nlp.sentence-boundary.service"

export interface INLPResult {
    raw: string
    type: VNTK.Utility.FastTextClassifierResult[]
    topic: VNTK.Utility.FastTextClassifierResult[]
}

@Injectable()
export class NaturalLanguageProcessing {
    constructor(private readonly rbsbd: RuleBasedSentenceBoundaryDetection) { }

    private fixMissing(input: VNTK.Utility.FastTextClassifierResult[], like: VNTK.Utility.FastTextClassifierResult[]) {
        if (input.length > 0 && input[0].value > constant.trustThreshold) {
            input.length = 1
            return
        }
        if (!like || like.length == 0 || like[0].value < constant.trustThreshold)
            return
        input.length = 0
        input.push(...like)
    }

    public async get(input: string, option?: { limitOrThreadhold?: number, fixMissing?: boolean }) {
        option = option || {}
        return new Promise((resolve, reject) => {
            this.rbsbd.get(input).then(raws => {
                let type = [] as Promise<VNTK.Utility.FastTextClassifierResult[]>[]
                let topic = [] as Promise<VNTK.Utility.FastTextClassifierResult[]>[]
                for (let i = 0, len = raws.length; i < len; i++) {
                    type[i] = classifier.type.predict(raws[i], option.limitOrThreadhold)
                    topic[i] = classifier.topic.predict(raws[i], option.limitOrThreadhold)
                }
                Promise.all([Promise.all(type), Promise.all(topic)]).then(([resType, resTopic]) => {
                    let ret = [] as INLPResult[]
                    let len = raws.length;
                    for (let i = 0; i < len; i++)
                        ret.push({
                            raw: raws[i],
                            type: resType[i],
                            topic: resTopic[i]
                        })
                    if (option.fixMissing) {
                        for (let i = 1; i < len; i++) {
                            this.fixMissing(ret[i].topic, ret[i - 1].topic)
                            this.fixMissing(ret[i].type, ret[i - 1].type)
                        }
                        for (let i = len - 2; i >= 0; i--) {
                            this.fixMissing(ret[i].topic, ret[i + 1].topic)
                            this.fixMissing(ret[i].type, ret[i + 1].type)
                        }
                    }
                    resolve(ret)
                })
            }).catch(err => reject(err))
        }) as Promise<INLPResult[]>
    }
}