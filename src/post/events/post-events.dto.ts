import { Post, Topic } from "../models";

export interface OnPostCreatedDTO {
    post: Post;
    topic: Topic;
}

export interface OnPostDeleted {
    post: Post;
}
