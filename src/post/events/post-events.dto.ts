import { Post, Topic } from "../modules/core";

export interface OnPostCreatedDTO {
    post: Post;
}

export interface OnPostDeleted {
    post: Post;
}
