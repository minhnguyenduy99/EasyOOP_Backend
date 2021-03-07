import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MODULE_KEYS } from "../consts";
import { RawAuthorizationData, RawRoleData, RawRolePolicyDatas } from "../dto";
import { IAuthorizationDataPersist } from "../interfaces";
import { EntityPolicy, Principal, Role, RolePolicy } from "../models";
import { PrincipalPolicy } from "../models/principal-policy.model";

@Injectable()
export class RolePersistService implements IAuthorizationDataPersist {
    constructor(
        @Inject(MODULE_KEYS.LOGGER) private readonly logger: Logger,
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        @InjectModel(EntityPolicy.name)
        private readonly entityPolicyModel: Model<EntityPolicy>,
        @InjectModel(Principal.name)
        private readonly principalModel: Model<Principal>,
        @InjectModel(PrincipalPolicy.name)
        private readonly principalPolicyModel: Model<PrincipalPolicy>,
    ) {}

    async persistRolesAndPolicies(rawData: RawAuthorizationData) {
        await Promise.all([
            this.persistRoles(rawData.roles),
            this.persistRolePolicies(rawData.rolePolicies),
        ]);
    }

    async persistPrincipalsAndPrincipalPolicies(principals: string[]) {
        await Promise.all([
            this.persistPrincipals(principals),
            this.persistPrincipalPolicies(principals),
        ]);
    }

    protected async persistRoles(roles: RawRoleData[]) {
        const session = await this.roleModel.db.startSession();
        try {
            session.startTransaction();

            await this.roleModel.deleteMany({});

            const data = roles.map((role) => ({
                role_name: role.roleName,
                role_policy_names: role.rolePolicies,
            }));
            const result = await this.roleModel.insertMany(data, {
                session: session,
            });

            await session.commitTransaction();
            this.logger.log("[RoleSync] Sync successfully: " + result.length);
        } catch (err) {
            await session.abortTransaction();
            this.logger.error("[RoleSync] Sync failed");
        } finally {
            session.endSession();
        }
    }

    protected async persistRolePolicies(policies: RawRolePolicyDatas) {
        const session = await this.roleModel.db.startSession();
        try {
            session.startTransaction();

            await this.entityPolicyModel.deleteMany({});

            const data = Object.keys(policies).map((name) => {
                const policy = policies[name];
                return {
                    policy_name: name,
                    entity_name: policy.entityName,
                    actions: policy.actions,
                };
            });

            const result = await this.entityPolicyModel.insertMany(data, {
                ordered: false,
            });

            await session.commitTransaction();
            this.logger.log(
                "[RolePolicySync] Sync successfully: " + result.length,
            );
        } catch (err) {
            await session.abortTransaction();
            this.logger.error("[RolePolicySync] Sync failed");
        } finally {
            session.endSession();
        }
    }

    protected async persistPrincipalPolicies(principalIds: string[]) {
        try {
            await this.deleteNonExistentPrincipalPolicies(principalIds);
            await this.deleteInvalidPrincipalPolicies();
        } catch (err) {
            this.logger.error("[PrincipalPolicySync] Sync failed: " + err);
        }
    }

    protected async persistPrincipals(principalIds: string[]) {
        try {
            await this.principalModel.deleteMany({
                principal_id: {
                    $nin: principalIds,
                },
            });
        } catch (err) {
            this.logger.error("[PrincipalSync] Sync failed: " + err);
        }
    }

    protected async deleteInvalidPrincipalPolicies() {
        const invalidResults = await this.principalPolicyModel.aggregate([
            {
                $lookup: {
                    from: RolePolicy.name.toLowerCase(),
                    let: {
                        rpn: "$role_policy_name",
                        an: "$action_name",
                    },
                    pipeline: [
                        {
                            $match: {
                                $eq: ["$policy_name", "$$rpn"],
                                $$ac: {
                                    $nin: "$actions",
                                },
                            },
                        },
                    ],
                    as: "role_policies",
                },
            },
            {
                $project: {
                    principal_id: 1,
                },
            },
        ]);

        await this.principalPolicyModel.deleteMany({
            principal_id: {
                $in: invalidResults.map((prin) => prin["principal_id"]),
            },
        });

        return invalidResults;
    }

    protected async deleteNonExistentPrincipalPolicies(principals: string[]) {
        await this.principalPolicyModel.deleteMany({
            principal_id: {
                $nin: principals,
            },
        });
    }
}
