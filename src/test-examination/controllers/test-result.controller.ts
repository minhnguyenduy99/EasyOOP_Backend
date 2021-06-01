import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseBoolPipe,
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
    TestSessionService,
} from "../core";

@Controller("test-results")
@UseInterceptors(ResponseSerializerInterceptor)
export class TestResultController {
    protected readonly TEST_RESULT_LIMIT = 10;
    protected readonly DETAIL_RESULT_LIMIT = 4;
    protected testResultPaginator: IPaginator;
    protected detailedPaginator: IPaginator;

    constructor(
        private testResultService: TestResultService,
        private testSessionService: TestSessionService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.testResultPaginator = paginatorFactory.createPaginator({
            pageURL: "/test-results/search",
            pageSize: this.TEST_RESULT_LIMIT,
        });
        this.detailedPaginator = paginatorFactory.createPaginator({
            pageURL: "/test-results/{resultId}/detail",
            pageSize: this.DETAIL_RESULT_LIMIT,
        });
    }

    @Post("/calculate")
    @Serialize(CommonResponse(TestResultDTO))
    async createTestResult(@Body(BodyValidationPipe) dto: CreateTestResultDTO) {
        const result = await this.testResultService.createTestResult(
            dto,
            false,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/by-session/:sessionId")
    @Serialize(CommonResponse(TestResultDTO))
    async getTestResultBySessionId(@Param("sessionId") sessionId: string) {
        const result = await this.testSessionService.getTestResultBySessionId(
            sessionId,
        );
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Post()
    @Serialize(CommonResponse(TestResultDTO))
    @TokenAuth()
    async saveTestResult(
        @Body(BodyValidationPipe) dto: CreateTestResultDTO,
        @AuthUserDecorator() user: AuthUserDto,
    ) {
        dto.user_id = user.user_id;
        const result = await this.testResultService.createTestResult(dto, true);
        if (result.error) {
            throw new BadRequestException(result);
        }
        return result;
    }

    @Get("/search")
    @Serialize(PaginationSerializer(TestResultDTO))
    @TokenAuth()
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

    @Get("/:resultId")
    @Serialize(TestResultDTO)
    @TokenAuth()
    async getDetailedTestResult(@Param("resultId") resultId: string) {
        const result = await this.testResultService.getTestResultById(resultId);
        if (!result) {
            throw new NotFoundException({ error: "Result ID not found" });
        }
        return result;
    }

    @Get("/:resultId/detail")
    @Serialize(DetailedTestResultDTO)
    @TokenAuth()
    async getDetailedResults(
        @Param("resultId") resultId: string,
        @Query("page", ParseIntPipe, ParsePagePipe) page: number,
    ) {
        const limitOptions = {
            start: (page - 1) * this.DETAIL_RESULT_LIMIT,
            limit: this.DETAIL_RESULT_LIMIT,
        };
        const result = await this.testResultService.getDetailedTestResults(
            resultId,
            limitOptions,
        );
        if (!result) {
            throw new NotFoundException({
                error: "Result ID not found",
            });
        }
        const { detailed_results, total_sentence_count } = result;
        const paginatedResult = await this.detailedPaginator.paginate(
            detailed_results,
            total_sentence_count,
            {
                page,
                placeholders: {
                    resultId,
                },
            },
        );
        return paginatedResult;
    }
}
