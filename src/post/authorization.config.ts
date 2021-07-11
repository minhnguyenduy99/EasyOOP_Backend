export default {
    policies: [
        {
            policyName: "creatorActionsOnPost",
            entity: "CreatorPost",
            actions: [
                "createPost",
                "updatePost",
                "getPostById",
                "deletePost",
                "getPosts",
                "getLatestPostOfTopic",
                "getAllTagsOfPostType",
                "getAllVersionsOfPost",
            ],
        },
        {
            policyName: "creatorActionsOnVerification",
            entity: "CreatorVerification",
            actions: [
                "cancelVerification",
                "batchDelete",
                "getLatestVerifications",
                "getHistoryOfPost",
                "update",
                "getVerificationsGroupedByPost",
                "getVerificationById",
            ],
        },
        {
            policyName: "creatorActionsOnTopic",
            entity: "CreatorTopic",
            actions: ["getAvailableTopics"],
        },
        {
            policyName: "managerActionsOnVerification",
            entity: "ManagerPostVerification",
            actions: [
                "verify",
                "unverify",
                "getVerificationsGroupedByPost",
                "getDetailedVerification",
                "getHistoryOfPost",
            ],
        },
        {
            policyName: "managerActionsOnPosts",
            entity: "ManagerPost",
            actions: ["getPostById", "getAllVersionsOfPost"],
        },
    ],
    assigns: {
        creator: [
            { entity: "CreatorPost", policies: ["creatorActionsOnPost"] },
            { entity: "CreatorTopic", policies: ["creatorActionsOnTopic"] },
            {
                entity: "CreatorVerification",
                policies: ["creatorActionsOnVerification"],
            },
        ],
        manager: [
            {
                entity: "ManagerPostVerification",
                policies: ["managerActionsOnVerification"],
            },
            {
                entity: "ManagerPost",
                policies: ["managerActionsOnPosts"],
            },
        ],
    },
};
