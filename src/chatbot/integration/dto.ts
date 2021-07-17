import { MenuDTO } from "src/menu/menu.dto";
import { PostDTO } from "src/post/dtos";
import { Q8ADTO } from "src/q8a/dtos";

export interface Question {
    type: string;
    value: string;
}

export type PostUrlHandler = (post: PostDTO) => string;

export interface FromPostOptions {
    postUrl: string | PostUrlHandler;
}

export class AnswerDTO {
    text: string;
    url?: string;
    title?: string;
    image?: string;

    constructor(dto: Partial<AnswerDTO>) {
        Object.assign(this, dto);
    }

    static fromPosts(posts: PostDTO[], options: FromPostOptions): AnswerDTO[] {
        const { postUrl } = options;
        return posts.map(
            (post) =>
                new AnswerDTO({
                    text: post.post_title,
                    url:
                        typeof postUrl === "function" ? postUrl(post) : postUrl,
                    title: post.post_title,
                    image: post["thumbnail_file_url"],
                }),
        );
    }

    static fromQuestions(questions: Q8ADTO[]): AnswerDTO[] {
        return questions.map(
            (question) =>
                new AnswerDTO({
                    text: question.answer,
                }),
        );
    }

    static fromMenu(menu: MenuDTO): AnswerDTO[] {
        const { children_menu, ...rootMenu } = menu;
        return [rootMenu].concat(...children_menu).map(
            (menu) =>
                new AnswerDTO({
                    text: menu.menu_name,
                }),
        );
    }
}
