import { Module } from "@nestjs/common";
import { NaturalLanguageProcessing } from "./nlp.natural-language-processing.service";
import { RuleBasedSentenceBoundaryDetection } from "./nlp.sentence-boundary.service"

@Module({
    providers: [RuleBasedSentenceBoundaryDetection, NaturalLanguageProcessing],
    exports: [RuleBasedSentenceBoundaryDetection, NaturalLanguageProcessing],
})
export class NLPModule { }