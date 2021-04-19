import { FastTextClassifier, VNTK } from "vntk"
import { join } from "path"
import { constant, Label } from "."

class MyClassifier extends FastTextClassifier {
    public async predict(document: string, limitOrThreadhold?: number) {
        return new Promise((resolve, rejects) => {
            var limit, threadHold

            if (limitOrThreadhold == null)
                limitOrThreadhold = 0
            if (limitOrThreadhold <= 1) {
                limit = constant.nlpLimit
                threadHold = Math.max(constant.askThreshold, limitOrThreadhold)
            } else {
                limit = Math.max(constant.nlpLimit, limitOrThreadhold)
                threadHold = constant.askThreshold
            }

            super.predict(document, limit, (err, res) => {
                if (err) {
                    rejects(err)
                    return;
                }
                if (res[0].value > constant.trustThreshold) {
                    res.length = 1
                    resolve(res)
                } else {
                    let i = res.length;
                    while (--i >= 0 && res[i].value < threadHold);
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