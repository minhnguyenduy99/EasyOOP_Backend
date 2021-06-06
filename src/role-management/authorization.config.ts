import { AuthFeatureConfig } from "src/lib/authorization";

export default {
    policies: [
        {
            policyName: "managerRoleFullAccess",
            entity: "manager_roleManagement",
            actions: ["assignManager", "getById", "updateManager"],
        },
        {
            policyName: "managerReadOnlyAccess",
            entity: "manager_roleManagement",
            actions: ["getById", "updateManager"],
        },
        {
            policyName: "creatorFullAccess",
            entity: "creator_roleManagement",
            actions: [
                "assignCreator",
                "getById",
                "findCreators",
                "updateCreator",
            ],
        },
        {
            policyName: "creatorReadOnlyAccess",
            entity: "creator_roleManagement",
            actions: ["getById", "findCreators"],
        },
        {
            policyName: "creatorWriteOnlyAccess",
            entity: "creator_roleManagement",
            actions: ["updateCreator"],
        },
    ],
    assigns: {
        creator: [
            {
                entity: "creator_roleManagement",
                policies: ["creatorReadOnlyAccess", "creatorWriteOnlyAccess"],
            },
        ],
        manager: [
            {
                entity: "creator_roleManagement",
                policies: ["creatorFullAccess"],
            },
            {
                entity: "manager_roleManagement",
                policies: ["managerReadOnlyAccess"],
            },
        ],
        admin: [
            {
                entity: "manager_roleManagement",
                policies: ["managerRoleFullAccess"],
            },
            {
                entity: "creator_roleManagement",
                policies: ["creatorFullAccess"],
            },
        ],
    },
} as AuthFeatureConfig;
