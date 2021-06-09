export default {
    InvalidTag: {
        code: -1,
        errorType: "QandA.InvalidType",
        error: "Tag ID or type is invalid",
    },
    UsedTag: {
        code: -2,
        errorType: "QandA.UsedTag",
        error: "Tag is being used",
    },
    QuestionNotFound: {
        code: -3,
        errorType: "QandA.QuestionNotFound",
        error: "Question not found",
    },
    ServiceError: {
        code: -10,
        errorType: "QandA.ServiceError",
        error: "Service Error",
    },
};
