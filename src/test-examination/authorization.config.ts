import { AuthFeatureConfig } from "src/lib/authorization";

export default {
    policies: [
        {
            policyName: "testFullAccess",
            entity: "testExamination",
            actions: [
                "getAllTopics",
                "createTest",
                "updateTest",
                "restoreTest",
                "deleteTest",
                "getTotalScoreOfTest",
                "addSentence",
                "addSentenceBulk",
                "removeSentences",
                "deleteSentenceById",
                "searchSentences",
                "updateSentence",
            ],
        },
    ],
    assigns: {
        creator: [
            {
                entity: "testExamination",
                policies: ["testFullAccess"],
            },
        ],
        manager: [
            {
                entity: "testExamination",
                policies: ["testFullAccess"],
            },
        ],
    },
} as AuthFeatureConfig;
