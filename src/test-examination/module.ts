import { Module } from "@nestjs/common";
import { AuthenticationModule } from "src/lib/authentication";
import { AuthorizationModule } from "src/lib/authorization";
import { PaginationModule } from "src/lib/pagination";
import {
    TestExaminationController,
    TestResultController,
    TestSessionController,
    TestExamViewerController,
} from "./controllers";
import { TestExaminationCoreModule } from "./core";
import authorizationConfig from "./authorization.config";
@Module({
    imports: [
        TestExaminationCoreModule,
        AuthenticationModule,
        PaginationModule,
        AuthorizationModule.forFeature({
            config: authorizationConfig,
        }),
    ],
    exports: [TestExaminationCoreModule],
    controllers: [
        TestExaminationController,
        TestResultController,
        TestSessionController,
        TestExamViewerController,
    ],
})
export class TestExaminationModule {}
