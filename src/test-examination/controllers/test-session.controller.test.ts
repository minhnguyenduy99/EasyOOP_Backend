import {
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from "@nestjs/common";
import {
    AuthUserDecorator,
    AuthUserDto,
    TokenAuth,
} from "src/lib/authentication";
import { TestSessionService } from "../core";

@Controller("/test-session")
export class TestSessionController {
    constructor(private testSessionService: TestSessionService) {}

    @Post("/:testId")
    async initTestSession(@Param("testId") testId: string) {
        const session = await this.testSessionService.createTestSession({
            testId,
        });
        return session;
    }

    @Get("/by-id")
    async getTestSentenceById(
        @Query("sessionId") sessionId: string,
        @Query("sentenceId") sentenceId: string,
    ) {
        const result = await this.testSessionService.getTestSentenceById(
            sessionId,
            sentenceId,
        );
        return result;
    }

    @Get("/by-index")
    async getTestSentenceByIndex(
        @Query("sessionId") sessionId: string,
        @Query("index", ParseIntPipe) index: number,
    ) {
        const result = await this.testSessionService.getTestSentenceByIndex(
            sessionId,
            index,
        );
        return result;
    }

    @Get("/bulk")
    async getTestSentences(
        @Query("sessionId") sessionId: string,
        @Query("start", ParseIntPipe) start: number,
        @Query("limit", ParseIntPipe) limit: number,
    ) {
        const result = await this.testSessionService.getTestSentenceInBulk(
            sessionId,
            {
                start,
                limit,
            },
        );
        return result;
    }

    @Put("/check")
    async checkSentence(
        @Query("sessionId") sessionId: string,
        @Query("sentenceId") sentenceId: string,
        @Query("answer", ParseIntPipe) answer: number,
    ) {
        const result = await this.testSessionService.updateSentenceResult(
            sessionId,
            sentenceId,
            answer,
        );
        return result;
    }

    @Put("/check-by-index")
    async checkSentenceByIndex(
        @Query("sessionId") sessionId: string,
        @Query("index", ParseIntPipe) index: number,
        @Query("answer", ParseIntPipe) answer: number,
    ) {
        const result = await this.testSessionService.updateSentenceResultByIndex(
            sessionId,
            index,
            answer,
        );
        return result;
    }

    @Post("/:sessionId/finish")
    async finishTest(@Param("sessionId") sessionId: string) {
        const result = await this.testSessionService.finishTest(sessionId);
        return result;
    }

    @Delete()
    async cancelTestSession(@Query("sessionId") sessionId: string) {
        const result = await this.testSessionService.deleteSession(sessionId);
        return { result };
    }
}
