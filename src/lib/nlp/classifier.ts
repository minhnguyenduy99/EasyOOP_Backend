import { FastTextClassifier, VNTK } from "vntk"
import { join } from "path"

const trustThreshold = process.env.TRUST_THRESHOLD ? Number.parseFloat(process.env.TRUST_THRESHOLD) : 0.7
const askThreshold = process.env.ASK_THRESHOLD ? Number.parseFloat(process.env.ASK_THRESHOLD) : 0.3
const nlpLimit = process.env.NLP_LIMIT ? Number.parseInt(process.env.NLP_LIMIT) : 0.3

class MyClassifier extends FastTextClassifier {
    public async predict(document: string, limitOrThreadhold?: number) {
        return new Promise((resolve, rejects) => {
            var limit, threadHold

            if (limitOrThreadhold == null)
                limitOrThreadhold = 0
            if (limitOrThreadhold <= 1) {
                limit = nlpLimit
                threadHold = Math.max(askThreshold, limitOrThreadhold)
            } else {
                limit = Math.max(nlpLimit, limitOrThreadhold)
                threadHold = askThreshold
            }

            super.predict(document, limit, (err, res) => {
                if (err) {
                    rejects(err)
                    return;
                }
                if (res[0].value > trustThreshold) {
                    res.length = 1
                    resolve(res)
                } else {
                    let i = res.length;
                    while (res[--i].value < threadHold);
                    res.length = i + 1
                    resolve(res)
                }
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