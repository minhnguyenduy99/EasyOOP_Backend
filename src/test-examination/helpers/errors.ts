export default {
    TestNotFound: {
        code: -1,
        errorType: "TestQuiz.TestNotFound",
        error: "Test ID not found",
    },
    QuestionNotFound: {
        code: -2,
        errorType: "TestQuiz.QuestionNotFound",
        error: "Sentence ID not found",
    },
    InvalidTimeLimited: {
        code: -3,
        errorType: "TestQuiz.InvalidTimeLimited",
        error: "Invalid limited time",
    },
    MissingUserID: {
        code: -4,
        errorType: "TestQuiz.MissingUserID",
        error: "Missing user ID",
    },
    TestSessionNotEstablished: {
        code: -5,
        errorType: "TestQuiz.TestSessionNotEstablished",
        error: "Test session is not established",
    },
    TestTopicNotFound: {
        code: -6,
        errorType: "TestQuiz.TestTopicNotFound",
        error: "Test topic is not found",
    },
    TestSessionTimeExpired: {
        code: -7,
        errorType: "TestQuiz.TestSessionTimeExpired",
        error: "Test session is expired",
    },
    ServiceError: {
        code: -10,
        errorType: "TestQuiz.ServiceError",
        error: "Service error",
    },
};
