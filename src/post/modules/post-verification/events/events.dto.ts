import { Post, Topic } from "../../core";

export interface OnPostVerifiedCreated {
    post: Post;
    topic: Topic;
}

export interface OnPostVerifiedDeleted {
    post: Post;
}
