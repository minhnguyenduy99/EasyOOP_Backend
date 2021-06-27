import { Injectable } from "@nestjs/common";
import { VNTK } from "vntk";
import keyword from "./out/keyword";

@Injectable()
export class KeyworkChecker {
    private length: number

    constructor() {
        this.length = keyword.length;
    }

    private check2(input: string, check: string[]) {
        for (let i = 0, len = check.length; i < len; i++)
            if (input.indexOf(check[i]) >= 0)
                return true
        return false
    }

    public async check(input: string) {
        for (let i = 0; i < this.length; i++) {
            if (this.check2(input, keyword[i].key))
                return [{ label: keyword[i].topic, value: 1 }] as VNTK.Utility.FastTextClassifierResult[]
        }
        return undefined
    }
}