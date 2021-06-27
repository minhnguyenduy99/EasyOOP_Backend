import { Module } from "@nestjs/common";
import { KeyworkChecker } from "./nlp.keyword-checker.service";
import { NaturalLanguageProcessing } from "./nlp.natural-language-processing.service";
import { RuleBasedSentenceBoundaryDetection } from "./nlp.sentence-boundary.service"

@Module({
    providers: [RuleBasedSentenceBoundaryDetection, NaturalLanguageProcessing, KeyworkChecker],
    exports: [RuleBasedSentenceBoundaryDetection, NaturalLanguageProcessing],
})
export class NLPModule { }