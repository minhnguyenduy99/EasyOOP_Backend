import { Injectable } from "@nestjs/common";
import { VNTK } from "vntk";
import { RBSBDService, classifier } from ".";

export interface INLPResult {
    raw: string
    type: VNTK.Utility.FastTextClassifierResult[]
    topic: VNTK.Utility.FastTextClassifierResult[]
}

@Injectable()
export class NaturalLanguageProcessing {
    constructor(private readonly rbsbd: RBSBDService) { }

    public async get(input: string, limitOrThreadhold?: number) {
        return new Promise((resolve, reject) => {
            this.rbsbd.get(input).then(raws => {
                let type = [] as Promise<VNTK.Utility.FastTextClassifierResult[]>[]
                let topic = [] as Promise<VNTK.Utility.FastTextClassifierResult[]>[]
                for (let i = 0, len = raws.length; i < len; i++) {
                    type[i] = classifier.topic.predict(raws[i], limitOrThreadhold)
                    topic[i] = classifier.type.predict(raws[i], limitOrThreadhold)
                }
                Promise.all([Promise.all(type), Promise.all(topic)]).then(([resType, resTopic]) => {
                    let ret = [] as INLPResult[]
                    for (let i = 0, len = raws.length; i < len; i++)
                        ret.push({
                            raw: raws[i],
                            type: resType[i],
                            topic: resTopic[i]
                        })
                    resolve(ret)
                })
            }).catch(err => reject(err))
        }) as Promise<INLPResult[]>
    }
}