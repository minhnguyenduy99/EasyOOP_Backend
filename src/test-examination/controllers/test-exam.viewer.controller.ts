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
import {
    SearchTestDTO,
    SentenceDTO,
    SentenceService,
    TestExaminationDTO,
    TestExaminationService,
    TestTopicDTO,
} from "../core";
import { TEST_AVAILABLE_STATUSES } from "../core/consts";
import { ERRORS } from "../helpers";

@Controller("/viewer/tests")
@UseInterceptors(ResponseSerializerInterceptor)
export class TestExamViewerController {
    protected readonly TEST_LIMIT = 10;
    protected readonly SENTENCES_PER_TEST_LIMIT = 10;
    protected testPaginator: IPaginator;

    constructor(
        private testService: TestExaminationService,
        private sentenceService: SentenceService,
        paginatorFactory: PaginatorFactory,
    ) {
        this.testPaginator = paginatorFactory.createPaginator({
            pageURL: "/viewer/tests/search",
            pageSize: this.SENTENCES_PER_TEST_LIMIT,
        });
    }

    @Get("/search")
    @Serialize(PaginationSerializer(TestExaminationDTO))
    async searchTest(
        @Query(QueryValidationPipe) search: SearchTestDTO,
        @Query("page", ParsePagePipe, ParseIntPipe) page: number,
    ) {
        const limitOption = {
            start: (page - 1) * this.TEST_LIMIT,
            limit: this.TEST_LIMIT,
        };

        search = {
            ...search,
            available_status: TEST_AVAILABLE_STATUSES.AVAILABLE,
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

    @Get("/topics")
    @Serialize(TestTopicDTO)
    async getTestsGroupedByTopic() {
        const results = await this.testService.getTestsGroupedByTopic();
        return results;
    }

    @Get("/:testId")
    @Serialize(TestExaminationDTO)
    async getTestDetailById(@Param("testId") testId: string) {
        const test = this.testService.getTestDetailById(testId);
        if (!test) {
            throw new NotFoundException(ERRORS.TestNotFound);
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
        };
        const { results, count } = await this.sentenceService.getSentences(
            testId,
            options,
        );
        const paginatedResult = await this.testPaginator.paginate(
            results,
            count,
            {
                additionQuery: {
                    page,
                },
            },
        );
        return paginatedResult;
    }
}
