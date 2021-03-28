import { posTag } from "vntk"
const pos_tag = posTag();

const filterMap = {
    P: true
} as object

const simply = function (document: string, customFilter?: string[]) {
    let map = filterMap;
    if (customFilter) {
        map = {}
        customFilter.forEach(e => map[e] = true)
    }
    let tag = pos_tag.tag(document) as any
    let ret = ""
    if (typeof tag === 'string')
        tag = [tag]
    tag.forEach(e => {
        if (!map[e[1]])
            ret += e[0] + " "
    })
    return ret.trim();
}

export default simply