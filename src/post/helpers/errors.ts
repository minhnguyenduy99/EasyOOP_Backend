export default {
    PostIsPending: {
        code: -1,
        errorType: "Post.PostIsPending",
        error: "Post is currently pending",
    },
    PostNotFound: {
        code: -2,
        errorType: "Post.PostNotFound",
        error: "Post not found",
    },
    TopicIsPending: {
        code: -3,
        errorType: "Post.TopicIsPending",
        error: "Topic currently has pending post",
    },
    InvalidPostStatus: {
        code: -4,
        errorType: "Post.InvalidPostStatus",
        error: "Post status is invalid",
    },
    InvalidTopic: {
        code: -5,
        errorType: "Post.InvalidTopic",
        error: "Topic is invalid",
    },
    InvalidPreviousPost: {
        code: -6,
        errorType: "Post.InvalidPreviousPost",
        error: "Previous post ID is invalid",
    },
    InvalidTags: {
        code: -7,
        errorType: "Post.InvalidTags",
        error: "Tags are invalid",
    },
    VerificationNotFound: {
        code: -8,
        errorType: "Post.VerificationNotFound",
        error: "Verification is not found or invalid",
    },
    ServiceError: {
        code: -10,
        errorType: "Post.ServiceError",
        error: "Service Error",
    },
};
