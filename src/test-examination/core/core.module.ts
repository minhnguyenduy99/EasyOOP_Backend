import { CacheModule, Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Sentence,
    SentenceSchema,
    TestExamination,
    TestExamninationSchema,
    TestResult,
    TestResultSchema,
} from "./models";
import {
    SentenceService,
    ServiceHelper,
    TestExaminationService,
    TestResultService,
    TestResultServiceHelper,
    TestSessionService,
} from "./services";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: TestExamination.name, schema: TestExamninationSchema },
            { name: Sentence.name, schema: SentenceSchema },
            { name: TestResult.name, schema: TestResultSchema },
        ]),
        CacheModule.register(),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("TestExaminationCore"),
        },
        ServiceHelper,
        TestExaminationService,
        SentenceService,
        TestResultService,
        TestResultServiceHelper,
        TestSessionService,
    ],
    exports: [
        MongooseModule,
        TestExaminationService,
        SentenceService,
        TestResultService,
        TestSessionService,
    ],
})
export class TestExaminationCoreModule {}
