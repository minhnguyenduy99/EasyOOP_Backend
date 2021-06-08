import { CacheModule, Logger, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
    Sentence,
    SentenceSchema,
    TestExamination,
    TestExamninationSchema,
    TestResult,
    TestResultSchema,
    TestTopic,
    TestTopicSchema,
} from "./models";
import {
    SentenceService,
    ServiceHelper,
    TestExaminationService,
    TestResultService,
    TestResultServiceHelper,
    TestSessionService,
} from "./services";
import { CONFIG_KEYS, configLoader } from "./config";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configLoader],
        }),
        MongooseModule.forFeature([
            { name: TestExamination.name, schema: TestExamninationSchema },
            { name: Sentence.name, schema: SentenceSchema },
            { name: TestResult.name, schema: TestResultSchema },
            { name: TestTopic.name, schema: TestTopicSchema },
        ]),
        CacheModule.register(),
    ],
    providers: [
        {
            provide: Logger,
            useValue: new Logger("TestExaminationCore"),
        },
        {
            provide: CONFIG_KEYS.CONFIG,
            useFactory: (configService: ConfigService) =>
                configService.get(CONFIG_KEYS.CONFIG),
            inject: [ConfigService],
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
