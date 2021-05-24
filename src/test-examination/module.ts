import { Module } from "@nestjs/common";
import { AuthenticationModule } from "src/lib/authentication";
import { PaginationModule } from "src/lib/pagination";
import {
    TestExaminationController,
    TestResultController,
    TestSessionController,
} from "./controllers";
import { TestExaminationCoreModule } from "./core";

@Module({
    imports: [
        TestExaminationCoreModule,
        AuthenticationModule,
        PaginationModule,
    ],
    controllers: [
        TestExaminationController,
        TestResultController,
        TestSessionController,
    ],
})
export class TestExaminationModule {}
