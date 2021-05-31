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

@Controller("/tests/test-session")
export class TestSessionController {
    constructor(private testSessionService: TestSessionService) {}

    @Post("/:testId")
    async initTestSession(@Param("testId") testId: string) {
        const session = await this.testSessionService.createTestSession({
            testId,
        });
        return session;
    }

    @Get()
    async getTestSentence(
        @Query("sessionId") sessionId: string,
        @Query("sentenceId") sentenceId: string,
    ) {
        const result = await this.testSessionService.getTestSentenceById(
            sessionId,
            sentenceId,
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

    @Post("/:testId/finish")
    @TokenAuth()
    async finishTest(
        @Query("sessionId") sessionId: string,
        @AuthUserDecorator() user: AuthUserDto,
    ) {
        const result = await this.testSessionService.finishTest(
            sessionId,
            user.user_id,
        );
        return result;
    }

    @Delete()
    async cancelTestSession(@Query("sessionId") sessionId: string) {
        const result = await this.testSessionService.deleteSession(sessionId);
        return { result };
    }
}
