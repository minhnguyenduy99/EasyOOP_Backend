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
        ],
        manager: [
            {
                entity: "ManagerPostVerification",
                policies: ["managerActionsOnPost"],
            },
        ],
    },
};
