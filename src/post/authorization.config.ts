export default {
    policies: [
        {
            policyName: "creatorActionsOnPost",
            entity: "CreatorPost",
            actions: [
                "createPost",
                "updatePost",
                "updatePendingPost",
                "deletePost",
                "getPosts",
                "getPendingPosts",
            ],
        },
        {
            policyName: "creatorActionsOnTopic",
            entity: "CreatorTopic",
            actions: ["getAvailableTopics"],
        },
        {
            policyName: "managerActionsOnPost",
            entity: "ManagerPostVerification",
            actions: [
                "verify",
                "unverify",
                "getSummaryGroupByManager",
                "getDetailedVerification",
                "findPendingVerifications",
                "findVerifications",
            ],
        },
    ],
    assigns: {
        creator: [
            { entity: "CreatorPost", policies: ["creatorActionsOnPost"] },
            { entity: "CreatorTopic", policies: ["creatorActionsOnTopic"] },
        ],
        manager: [
            {
                entity: "ManagerPostVerification",
                policies: ["managerActionsOnPost"],
            },
        ],
    },
};
