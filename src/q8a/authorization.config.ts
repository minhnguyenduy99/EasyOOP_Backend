import { AuthFeatureConfig } from "src/lib/authorization";

export default {
    policies: [
        {
            policyName: "qandaFullAccess",
            entity: "qanda",
            actions: [
                "getUnusedQuestionTags",
                "createQ8A",
                "updateQ8A",
                "getQ8AById",
                "getQ8AByTag",
                "searchUnusedTags",
            ],
        },
    ],
    assigns: {
        creator: [
            {
                entity: "qanda",
                policies: ["qandaFullAccess"],
            },
        ],
        manager: [
            {
                entity: "qanda",
                policies: ["qandaFullAccess"],
            },
        ],
        admin: [
            {
                entity: "qanda",
                policies: ["qandaFullAccess"],
            },
        ],
    },
} as AuthFeatureConfig;
