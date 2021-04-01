import { BayesClassifier } from "vntk"
import { readFile } from "fs"
import { simply } from ".";

interface ClassifierDTO {
    label: string
    value: number
}

export class Classifier extends BayesClassifier {
    public getClassificationsAsync(observation: string, limitOrThreshold?: number): ClassifierDTO[] {
        let ret = super["getClassifications"](super["textToFeatures"](simply(observation)))
        let total = 0;
        let len = ret.length
        for (let i = 0; i < len; i++) {
            ret[i].value /= ret[len - 1].value
            total += ret[i].value
        }
        for (let i = 0; i < len; i++)
            ret[i].value /= total
        if (limitOrThreshold == null)
            return ret;

        limitOrThreshold = Math.min(limitOrThreshold, len)
        if (limitOrThreshold >= 1)
            ret.length = limitOrThreshold
        else
            while (ret.length > 0 && ret[ret.length - 1].value < limitOrThreshold)
                ret.pop()
        return ret;
    }

    public async getClassifications(observation: string, limitOrThreshold?: number) {
        return this.getClassificationsAsync(observation, limitOrThreshold)
    }

    public load(path: string, callback = undefined) {
        readFile(path, (err, data) => {
            if (!callback)
                callback = (err) => { if (err) throw err }
            if (!err) {
                let o = JSON.parse(data.toString())
                for (let key in o)
                    this[key] = o[key]
            }
            callback(err)
        })
    }
}