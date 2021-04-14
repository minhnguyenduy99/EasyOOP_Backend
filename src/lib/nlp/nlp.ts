import { FastTextClassifier, VNTK } from "vntk"
import { join } from "path"

class MyClassifier extends FastTextClassifier {
    defaultLimit: number

    constructor(modelPath: string) {
        super(modelPath)
        this.defaultLimit = Number.parseInt(process.env.NLP_LIMIT) || 4
    }

    public async getClassifications(document: string, limit?: number) {
        limit = limit || this.defaultLimit

        return new Promise((resolve, rejects) => {
            super.predict(document, limit, (err, res) => {
                if (err)
                    rejects(err)
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