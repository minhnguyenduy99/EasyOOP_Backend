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
import { ResponseSerializerInterceptor, Serialize } from "src/lib/helpers";
import { PaginationSerializer } from "src/lib/helpers/serializers/base-pagination.serializer";
import {
    IPaginator,
    PaginatorFactory,
    ParsePagePipe,
} from "src/lib/pagination";
import {
    SentenceDTO,
    TestExaminationDTO,
    TestExaminationService,
} from "../core";
import { TEST_AVAILABLE_STATUSES } from "../core/consts";

@Controller("/viewer/tests")
@UseInterceptors(ResponseSerializerInterceptor)
export class TestExamViewerController {
    protected readonly TEST_LIMIT = 10;
    protected readonly SENTENCES_PER_TEST_LIMIT = 4;
    protected testPaginator: IPaginator;

    constructor(
        private testService: TestExaminationService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.testPaginator = paginatorFactory.createPaginator({
            pageURL: "/viewer/tests/search",
            pageSize: this.SENTENCES_PER_TEST_LIMIT,
        });
    }

    @Get("/:testId")
    @Serialize(TestExaminationDTO)
    async getTestDetailById(@Param("testId") testId: string) {
        const test = await this.testService.getTestById(testId, {
            groupWithSentences: false,
            verifying_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
        });
        if (!test) {
            throw new NotFoundException({
                error: "Test not found",
            });
        }
        return test;
    }

    @Get("/:testId/sentences")
    @Serialize(PaginationSerializer(SentenceDTO))
    async getTestSentence(
        @Param("testId") testId: string,
        @Query("page", ParseIntPipe, ParsePagePipe) page: number,
    ) {
        const options = {
            start: (page - 1) * this.SENTENCES_PER_TEST_LIMIT,
            limit: this.SENTENCES_PER_TEST_LIMIT,
            verifying_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
        };
        const result = await this.testService.getTestWithSentences(
            testId,
            options,
        );
        if (result.error) {
            throw new BadRequestException(test);
        }
        const {
            data: {
                total_count,
                test: { sentences },
            },
        } = result;
        const paginatedResult = await this.testPaginator.paginate(
            sentences,
            total_count,
            {
                additionQuery: {
                    page,
                },
            },
        );
        return paginatedResult;
    }
}
