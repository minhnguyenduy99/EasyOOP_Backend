import {
    Controller,
    Delete,
    Param,
    ParseIntPipe,
    Post,
    Query,
} from "@nestjs/common";
import {
    AuthUserDecorator,
    AuthUserDto,
    TokenAuth,
} from "src/lib/authentication";
import { TestSessionService } from "../core";

@Controller("/tests/test-session")
@TokenAuth()
export class TestSessionController {
    constructor(private testSessionService: TestSessionService) {}

    @Post("/:testId")
    async initTestSession(
        @AuthUserDecorator() user: AuthUserDto,
        @Param("testId") testId: string,
    ) {
        const session = await this.testSessionService.createTestSession({
            testId,
            userId: user.user_id,
        });
        return session;
    }

    @Post("/:testId/finish")
    async finishTest(
        @AuthUserDecorator() user: AuthUserDto,
        @Param("testId") testId: string,
    ) {
        const result = await this.testSessionService.finishTest(
            user.user_id,
            testId,
        );
        return result;
    }

    @Post("/:testId/:sentenceId")
    async checkSentence(
        @AuthUserDecorator() user: AuthUserDto,
        @Param("testId") testId: string,
        @Param("sentenceId") sentenceId: string,
        @Query("answer", ParseIntPipe) answer: number,
    ) {
        const result = await this.testSessionService.updateSentenceResult(
            user.user_id,
            testId,
            sentenceId,
            answer,
        );
        return result;
    }

    @Delete("/:testId")
    async cancelTestSession(
        @AuthUserDecorator() user: AuthUserDto,
        @Param("testId") testId: string,
    ) {
        const result = await this.testSessionService.deleteSession(
            user.user_id,
            testId,
        );
        return { result };
    }
}
