import { BayesClassifier } from "vntk"
import { readFile } from "fs"

interface ClassifierDTO {
    label: string
    value: number
}

export class Classifier extends BayesClassifier {
    public getClassifications(observation): ClassifierDTO {
        let ret = super["getClassifications"](super["textToFeatures"](observation))
        if (ret.length >= 2) {
            ret[0].value = ret[0].value / ret[1].value
        }
        return ret[0]
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