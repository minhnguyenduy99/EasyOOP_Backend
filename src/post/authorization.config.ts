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
                "getLatestPostOfTopic",
                "getAllTagsOfPostType",
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
                "getSummaryGroupByManager",
                "getDetailedVerification",
                "findPendingVerifications",
                "findVerifications",
            ],
        },
        {
            policyName: "managerActionsOnPosts",
            entity: "ManagerPost",
            actions: ["getPostById"],
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
                policies: ["managerActionsOnVerification"],
            },
            {
                entity: "ManagerPost",
                policies: ["managerActionsOnPosts"],
            },
        ],
    },
};
