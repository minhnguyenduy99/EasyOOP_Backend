import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MenuService } from "src/menu";
import { PostService } from "src/post/services";
import { Q8AService } from "src/q8a";
import { TagType } from "src/tag";
import { CONFIG_KEYS } from "./config";
import { AnswerDTO, Question } from "./dto";

@Injectable()
export class IntegrationService {
    constructor(
        private postService: PostService,
        private q8aService: Q8AService,
        private menuService: MenuService,
        private configService: ConfigService,
    ) {}

    getResultByTag(question: Question) {
        const { type, value } = question;
        switch (type) {
            case TagType.post:
            case TagType.example:
                return this.getPostResults(value);
            case TagType.menu:
                return this.getMenuResults(value);
            case TagType.question:
                return this.getQ8AResults(value);
        }
    }

    protected async getPostResults(tag: string) {
        const { results } = await this.postService.getPostsByTag([tag]);
        return AnswerDTO.fromPosts(results, {
            postUrl: (post) =>
                `${this.configService.get(CONFIG_KEYS.POST_URL)}/${
                    post.post_id
                }`,
        });
    }

    protected async getQ8AResults(tag: string) {
        const q8a = await this.q8aService.getQ8AByTag(tag);
        if (!q8a) {
            return [];
        }
        return AnswerDTO.fromQuestions([q8a]);
    }

    protected async getMenuResults(tag: string) {
        const menu = await this.menuService.getMenusByTag(tag);
        if (!menu) {
            return [];
        }
        return AnswerDTO.fromMenu(menu);
    }
}
