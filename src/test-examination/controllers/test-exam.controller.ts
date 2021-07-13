import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseBoolPipe,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    AuthUserDecorator,
    AuthUserDto,
    TokenAuth,
} from "src/lib/authentication";
import { AuthorizeClass, NonAuthorize } from "src/lib/authorization";
import {
    BodyValidationPipe,
    QueryValidationPipe,
    ResponseSerializerInterceptor,
    Serialize,
} from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import { CommonResponse } from "src/lib/types";
import { RoleAuthorizationGuard } from "src/role-management";
import {
    CreateSentenceDTO,
    CreateTestExaminationDTO,
    DetailedTestExamnimationDTO,
    SearchTestDTO,
    SentenceDTO,
    SentenceService,
    TestExaminationDTO,
    TestExaminationService,
    TestTopicDTO,
    UpdateSentenceDTO,
    UpdateTestExaminationDTO,
} from "../core";
import { ERRORS } from "../helpers";

@Controller("exams")
@TokenAuth()
@UseGuards(RoleAuthorizationGuard)
@UseInterceptors(ResponseSerializerInterceptor)
@AuthorizeClass({
    entity: "testExamination",
})
export class TestExaminationController {
    protected readonly TEST_LIMIT = 10;
    protected readonly SENTENCES_PER_TEST_LIMIT = 10;
    protected testPaginator: IPaginator;
    protected sentenceResultPaginator: IPaginator;

    constructor(
        private testService: TestExaminationService,
        private sentenceService: SentenceService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.testPaginator = paginatorFactory.createPaginator({
            pageURL: "/exams/search",
            pageSize: this.TEST_LIMIT,
        });
        this.sentenceResultPaginator = paginatorFactory.createPaginator({
            pageURL: "/exams/{testId}/sentences",
            pageSize: this.SENTENCES_PER_TEST_LIMIT,
        });
    }

    @Get("/topics/all")
    @Serialize(TestTopicDTO)
    async getAllTopics() {
        const topics = await this.testService.getAllTopics();
        return topics;
    }

    @Post()
    @Serialize(CommonResponse(TestExaminationDTO))
    async createTest(
        @AuthUserDecorator() user: AuthUserDto,
        @Body(BodyValidationPipe) dto: CreateTestExaminationDTO,
    ) {
        dto.creator_id = user.role_id;
        const testResult = await this.testService.createTest(dto);
        if (testResult.error) {
            throw new BadRequestException(testResult);
        }
        return testResult;
    }

    @Get("/search")
    @NonAuthorize()
    @Serialize(PaginationSerializer(TestExaminationDTO))
    async searchTest(
        @Query(QueryValidationPipe) search: SearchTestDTO,
        @Query("page", ParsePagePipe, ParseIntPipe) page: number,
    ) {
        const limitOption = {
            start: (page - 1) * this.TEST_LIMIT,
            limit: this.TEST_LIMIT,
        };

        const { count, results } = await this.testService.searchTest(
            search,
            limitOption,
        );
        const paginatedResult = await this.testPaginator.paginate(
            results,
            count,
            {
                page,
                additionQuery: { ...search, page },
            },
        );
        return paginatedResult;
    }

    @Put("/:testId")
    @Serialize(CommonResponse(TestExaminationDTO))
    async updateTest(
        @Param("testId") testId: string,
        @Body(BodyValidationPipe) dto: UpdateTestExaminationDTO,
        @AuthUserDecorator() user: AuthUserDto,
    ) {
        dto.creator_id = user.role_id;
        const testResult = await this.testService.updateTest(testId, dto);
        if (testResult.error) {
            throw new BadRequestException(testResult);
        }
        return testResult;
    }

    @Put("/:testId/restore")
    @Serialize(CommonResponse(TestExaminationDTO))
    async restoreTest(@Param("testId") testId: string) {
        const testResult = await this.testService.restoreTest(testId);
        if (!testResult) {
            throw new NotFoundException(testResult);
        }
        return testResult;
    }

    @Delete("/:testId")
    @Serialize(CommonResponse(TestExaminationDTO))
    async deleteTest(
        @Param("testId") testId: string,
        @Query("permanently", ParseBoolPipe) permanently = false,
    ) {
        let result;
        if (permanently) {
            result = await this.testService.deleteTestPermanently(testId);
        } else {
            result = await this.testService.deleteTest(testId);
        }
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/:testId/total-score")
    async getTotalScoreOfTest(@Param("testId") testId: string) {
        const scoreResult = await this.testService.getTotalScore(testId);
        if (!scoreResult) {
            throw new NotFoundException(ERRORS.TestNotFound);
        }
        return scoreResult;
    }

    @Post("/:testId/sentences")
    async addSentence(
        @Param("testId") testId: string,
        @Body(BodyValidationPipe) dto: CreateSentenceDTO,
    ) {
        const result = await this.testService.addSentence(testId, dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Post("/:testId/sentences/bulk")
    async addSentenceBulk(
        @Param("testId") testId: string,
        @Body(BodyValidationPipe) dtos: CreateSentenceDTO[],
    ) {
        const result = await this.testService.addTestSentencesSequentially(
            testId,
            dtos,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    // @Delete("/:testId/sentences")
    // async removeSentences(
    //     @Param("testId") testId: string,
    //     @Body(BodyValidationPipe) sentenceIds: string[],
    // ) {
    //     const result = await this.testService.removeSentences(
    //         testId,
    //         sentenceIds,
    //     );
    //     if (result.error) {
    //         throw new BadRequestException(result);
    //     }
    //     return result;
    // }

    // @Delete("/sentences/:sentenceId")
    // async deleteSentenceById(@Param("sentenceId") sentenceId: string) {
    //     const result = await this.testService.deleteSentenceById(sentenceId);
    //     if (result.error) {
    //         throw new BadRequestException(result);
    //     }
    //     return result;
    // }

    @Get("/:testId/sentences")
    @Serialize(DetailedTestExamnimationDTO)
    async searchSentences(
        @Param("testId") testId: string,
        @Query("page", ParsePagePipe) page: number,
        @Query("includeTest", ParseBoolPipe) includeTest = false,
    ) {
        const limit = {
            start: (page - 1) * this.SENTENCES_PER_TEST_LIMIT,
            limit: this.SENTENCES_PER_TEST_LIMIT,
        };
        const [test, sentenceResult] = await Promise.all([
            this.testService.getTestDetailById(testId),
            this.sentenceService.getSentences(testId, limit),
        ]);

        if (!test) {
            throw new NotFoundException(ERRORS.TestNotFound);
        }

        const { results, count } = sentenceResult;

        const paginatedResult = await this.sentenceResultPaginator.paginate(
            results,
            count,
            {
                page,
                placeholders: {
                    testId,
                },
                additionQuery: {
                    includeTest,
                },
            },
        );
        if (!includeTest) {
            return paginatedResult;
        }
        paginatedResult["test"] = test;
        return paginatedResult;
    }

    @Put("/:testId/sentences/:sentenceId")
    @Serialize(CommonResponse(SentenceDTO))
    async updateSentence(
        @Param("testId") testId: string,
        @Param("sentenceId") sentenceId: string,
        @Body(BodyValidationPipe) dto: UpdateSentenceDTO,
    ) {
        const result = await this.testService.updateSentence(
            testId,
            sentenceId,
            dto,
        );
        if (result.error) {
            if (result.code === ERRORS.QuestionNotFound.code) {
                throw new NotFoundException(result);
            }
            throw new BadRequestException(result);
        }
        return result;
    }
}
