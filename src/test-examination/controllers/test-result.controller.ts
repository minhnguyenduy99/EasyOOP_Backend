import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseInterceptors,
} from "@nestjs/common";
import {
    AuthUserDecorator,
    AuthUserDto,
    TokenAuth,
} from "src/lib/authentication";
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
import {
    CreateTestResultDTO,
    DetailedTestResultDTO,
    SearchTestResultsDTO,
    TestResultDTO,
    TestResultService,
} from "../core";

@Controller("test-results")
@TokenAuth()
@UseInterceptors(ResponseSerializerInterceptor)
export class TestResultController {
    protected readonly TEST_RESULT_LIMIT = 10;
    protected readonly DETAIL_RESULT_LIMIT = 5;
    protected testResultPaginator: IPaginator;
    protected detailedPaginator: IPaginator;

    constructor(
        private testResultService: TestResultService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.testResultPaginator = paginatorFactory.createPaginator({
            pageURL: "/test-results/search",
            pageSize: this.TEST_RESULT_LIMIT,
        });
        this.detailedPaginator = paginatorFactory.createPaginator({
            pageURL: "/test-results/{testId}/detail",
            pageSize: this.DETAIL_RESULT_LIMIT,
        });
    }

    @Post()
    @Serialize(CommonResponse(TestResultDTO))
    async createTestResult(
        @Body(BodyValidationPipe) dto: CreateTestResultDTO,
        @AuthUserDecorator() user: AuthUserDto,
    ) {
        dto.user_id = user.user_id;
        const result = await this.testResultService.createTestResult(dto);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/search")
    @Serialize(PaginationSerializer(TestResultDTO))
    async getTestResultsByUser(
        @Query(QueryValidationPipe) query: SearchTestResultsDTO,
        @Query("page", ParseIntPipe, ParsePagePipe) page: number,
        @AuthUserDecorator() user: AuthUserDto,
    ) {
        const limitOptions = {
            start: (page - 1) * this.TEST_RESULT_LIMIT,
            limit: this.TEST_RESULT_LIMIT,
        };
        const {
            results,
            count,
        } = await this.testResultService.getTestResultsByUser(user.user_id, {
            ...query,
            ...limitOptions,
        });
        const paginatedResults = await this.testResultPaginator.paginate(
            results,
            count,
            {
                additionQuery: query,
            },
        );
        return paginatedResults;
    }

    @Get("/:testId")
    @Serialize(TestResultDTO)
    async getDetailedTestResult(
        @AuthUserDecorator() user: AuthUserDto,
        @Param("testId") testId: string,
    ) {
        const result = await this.testResultService.getTestResult(
            user.user_id,
            testId,
        );
        if (!result) {
            throw new NotFoundException({ error: "Test ID not found" });
        }
        return result;
    }

    @Get("/:testId/detail")
    @Serialize(DetailedTestResultDTO)
    async getDetailedResults(
        @Param("testId") testId: string,
        @Query("page", ParseIntPipe, ParsePagePipe) page: number,
        @AuthUserDecorator() user: AuthUserDto,
    ) {
        const limitOptions = {
            start: (page - 1) * this.DETAIL_RESULT_LIMIT,
            limit: this.DETAIL_RESULT_LIMIT,
        };
        const result = await this.testResultService.getDetailedTestResults(
            user.user_id,
            testId,
            limitOptions,
        );
        if (!result) {
            throw new NotFoundException({
                error: "Test ID not found",
            });
        }
        const { detailed_results, total_sentence_count } = result;
        const paginatedResult = await this.detailedPaginator.paginate(
            detailed_results,
            total_sentence_count,
            {
                placeholders: {
                    testId,
                },
                additionQuery: {
                    page,
                },
            },
        );
        return paginatedResult;
    }
}
