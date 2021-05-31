import { Module } from "@nestjs/common";
import { AuthenticationModule } from "src/lib/authentication";
import { PaginationModule } from "src/lib/pagination";
import {
    TestExaminationController,
    TestResultController,
    TestSessionController,
    TestExamViewerController,
} from "./controllers";
import { TestExaminationCoreModule } from "./core";

@Module({
    imports: [
        TestExaminationCoreModule,
        AuthenticationModule,
        PaginationModule,
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
