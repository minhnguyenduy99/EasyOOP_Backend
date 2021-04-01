import { Classifier } from "./Classifier"

let dataFolder = "src/lib/nlp/train/"
let classifier = {
    type: new Classifier(),
    topic: new Classifier()
}

for (let key in classifier)
    classifier[key].load(dataFolder + key)

export default classifier