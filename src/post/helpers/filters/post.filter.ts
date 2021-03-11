import { Injectable } from "@nestjs/common";
import { AggregateBuilder } from "src/lib/database/mongo";

export interface PostFilterOptions {
    keyword?: string;
    topic_id?: string;
}

export interface IPostFilter {
    filter(options: PostFilterOptions): any;
}

@Injectable()
export class PostFilter implements IPostFilter {
    filter(options: PostFilterOptions): any[] {
        const { keyword = "", topic_id = null } = options;
        const builder = new AggregateBuilder();
        builder.match({
            ...(keyword && {
                $text: {
                    $search: keyword,
                },
            }),
            ...(topic_id && { topic_id }),
        });
        return builder.build();
    }
}
