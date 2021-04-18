import { Injectable } from "@nestjs/common";
import { posTag } from "vntk"
import { constant } from ".";
const pos_tag = posTag();

@Injectable()
export default class RuleBasedSentenceBoundaryDetection {
    private getAsync(input: string): string[] {
        let data = null
        data = pos_tag.tag(input)
        data.forEach(e => e[1] = constant.postag2path[e[1]])
        // merger by position in sentence
        let i = 0, index = 0, len = data.length
        while (i < len) {
            data[index] = data[i++]
            while (i < len && (data[i - 1][1] === "-" || data[i - 1][1] === data[i][1])) {
                data[index][0] += " " + data[i][0]
                data[index][1] = data[i][1]
                i++
            }
            index++
        }
        data.length = index

        i = 0, len = data.length, index = 0
        let ret = []
        let S = "", V = "", O = ""
        // fix unknow tag
        if (data[len - 1][1] == "-")
            data[len - 1][1] = "SO"
        // apply sentance = S + V + O
        while (i < len) {
            if (data[i][1] == "E") {
                i++;
                continue;
            }
            S = data[i][1].includes("S") ? data[i++][0] : ""
            V = (data[i] && data[i][1] == "V") ? data[i++][0] : ""

            if (data[i] && data[i][1].includes("O")) { // enough for complete sentance
                O = data[i][0]
                ret[index++] = `${S} ${V} ${O}`.trim()
            } else {
                ret[index++] = `${S} ${V} ${O}`.trim()
            }
            O = ""
            i++
        }
        return ret
    }

    public async get(input: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.getAsync(input))
            } catch (e) {
                reject(e)
            }
        })
    }
}