import { FastTextClassifier, VNTK } from "vntk"
import { join } from "path"

class MyClassifier extends FastTextClassifier {
    defaultLimit: number
    minThreadHold: number

    constructor(modelPath: string) {
        super(modelPath)
        this.defaultLimit = Number.parseInt(process.env.NLP_LIMIT) || 4
        this.minThreadHold = Number.parseFloat(process.env.ASK_THRESHOLD) || 0.3
    }

    public async getClassifications(document: string, limitOrThreadhold?: number) {
        return new Promise((resolve, rejects) => {
            var limit, threadHold

            if (limitOrThreadhold == null)
                limitOrThreadhold = 0
            if (limitOrThreadhold <= 1) {
                limit = this.defaultLimit
                threadHold = Math.max(this.minThreadHold, limitOrThreadhold)
            } else {
                limit = Math.max(this.defaultLimit, limitOrThreadhold)
                threadHold = this.minThreadHold
            }

            super.predict(document, limit, (err, res) => {
                if (err) {
                    rejects(err)
                    return;
                }
                let i = res.length;
                while (res[--i].value < threadHold);
                res.length = i + 1
                resolve(res)
            })
        }) as Promise<VNTK.Utility.FastTextClassifierResult[]>
    }
}

interface iClassifier {
    type: MyClassifier,
    topic: MyClassifier
}

let classifier = {
    type: null,
    topic: null
} as iClassifier

for (let key in classifier)
    classifier[key] = new MyClassifier(join(__dirname, "out", key + ".bin"))

export default classifier