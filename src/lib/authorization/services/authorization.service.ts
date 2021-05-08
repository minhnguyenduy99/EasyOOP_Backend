import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    CreatePrincipalOptions,
    CreatePrincipalPolicyOptions,
    CreateRoleActionPolicyOptions,
    PrincipalPolicyKey,
} from "../dto";
import {
    InvalidActionException,
    InvalidPrincipalException,
    InvalidRoleAssignException,
    InvalidRolePolicyException,
} from "../errors";
import {
    PrincipalPolicy,
    Principal,
    PrincipalDTO,
    PrincipalPolicyDTO,
    Role,
    RoleActionPolicy,
    RolePolicy,
    RolePolicyDTO,
} from "../models";
import { ActionType, MODULE_KEYS, PolicyActionType } from "../consts";
import { AuthData, IAuthorizationService } from "../interfaces";
import { AuthorizationCoreService } from "./authorization-core.service";

@Injectable()
export class AuthorizationService implements IAuthorizationService {
    constructor(
        @InjectModel(PrincipalPolicy.name)
        private readonly principalPolicyModel: Model<PrincipalPolicy>,
        @InjectModel(Principal.name)
        private readonly principalModel: Model<Principal>,
        @InjectModel(RolePolicy.name)
        private readonly rolePolicyModel: Model<RolePolicy>,
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        @InjectModel(RoleActionPolicy.name)
        private readonly roleActionPolicyModel: Model<RoleActionPolicy>,
        @Inject(MODULE_KEYS.LOGGER) private readonly logger: Logger,
        private readonly coreService: AuthorizationCoreService,
    ) {}

    getRole(key: string) {
        return this.coreService.allRoles[key];
    }

    /**
     * Check the authorization
     * @param type
     */
    async authorize(type: PolicyActionType, authData: AuthData) {
        console.log(authData);
        if (type === ActionType.role) {
            return this.authorizeByRolePolicy(authData);
        }
        return this.authorizeByPrincipalPolicy(authData);
    }

    /**
     * Check the authorization of role policy with action type of `role`
     * @param param0
     */
    async authorizeByRolePolicy({
        principal_id,
        entity_name,
        action_name,
    }: AuthData) {
        const principal = await this.principalModel
            .findOne({
                principal_id,
            })
            .populate({
                path: "role_action_policies",
                match: {
                    entity_name,
                    action_name,
                },
                justOne: true,
            });
        return principal && principal?.["role_action_policies"]?.length > 0
            ? true
            : false;
    }

    /**
     * Check the authorization using principal policy. Only applied to `resource` action type
     * @param param0
     */
    async authorizeByPrincipalPolicy({
        principal_id,
        entity_name,
        action_name,
        resources = [],
    }: AuthData) {
        const principalPolicy = await this.principalPolicyModel.findOne({
            $and: [
                { principal_id },
                { entity_name },
                { action_name },
                {
                    $or: [
                        { resources: "*" },
                        {
                            resources: {
                                $all:
                                    resources.length !== undefined
                                        ? (resources as string[])
                                        : [resources],
                            },
                        },
                    ],
                },
            ],
        });
        return principalPolicy ? true : false;
    }

    protected doesActionExist(rolePolicy: RolePolicyDTO, actionName: string) {
        for (let policy of rolePolicy.entity_policies) {
            for (let action in policy.actions) {
                if (action === actionName) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Create new principal. If success, all the related principal policies are automatically created
     * with empty resources.
     *
     * If `options.self_added` is true, the `principal_id` is added to all the principal policies
     * of principal
     *
     * @param options
     */
    async createPrincipal(
        options: CreatePrincipalOptions,
    ): Promise<PrincipalDTO> {
        if (!options || !options.role_name || !options.principal_id) {
            throw new InvalidRoleAssignException();
        }
        const role = await this.roleModel.findOne({
            role_name: options.role_name,
        });
        if (!role) {
            throw new InvalidRoleAssignException();
        }
        const session = await this.principalModel.db.startSession();
        let principal: PrincipalDTO, success;
        try {
            session.startTransaction();
            [principal, success] = await Promise.all([
                this.persistPrincipal(options.principal_id, options.role_name),
                this.createDefaultPrincipalPolicies(
                    {
                        principal_id: options.principal_id,
                        role_name: options.role_name,
                    },
                    options.self_added,
                ),
            ]);
            if (!principal || !success) {
                await session.abortTransaction();
            } else {
                await session.commitTransaction();
            }
        } catch (err) {
            await session.abortTransaction();
            return null;
        } finally {
            session.endSession();
            return principal;
        }
    }

    /**
     * Create a new principal policy applied on one or more resources
     * @param options
     */
    async createPrincipalPolicy(
        options: CreatePrincipalPolicyOptions,
    ): Promise<PrincipalPolicyDTO> {
        const principal = await this.principalModel.findOne({
            principal_id: options.principal_id,
        });

        if (!principal) {
            throw new InvalidPrincipalException();
        }

        const rolePolicy = await this.findRolePolicy(
            principal.role_name,
            options.entity_name,
        );
        if (!rolePolicy) {
            throw new InvalidRolePolicyException();
        }

        const actionExists = this.doesActionExist(
            rolePolicy,
            options.action_name,
        );
        if (!actionExists) {
            throw new InvalidActionException();
        }

        const result = await this.createResourceBasedPrincipalPolicy(options);
        return result;
    }

    /**
     * Create a new role action policy or add the principal to the policy of it already exists
     */
    async createRoleActionPolicy(options: CreateRoleActionPolicyOptions) {
        const { principal_id, ...createOptions } = options;

        const principal = await this.principalModel.findOne({
            principal_id,
        });
        if (!principal) {
            throw new InvalidPrincipalException();
        }
        try {
            await this.roleActionPolicyModel.updateOne(
                {
                    role_name: principal.role_name,
                    entity_name: createOptions.entity_name,
                    action_name: createOptions.action_name,
                },
                {
                    $addToSet: {
                        principals: principal_id,
                    },
                },
                {
                    upsert: true,
                },
            );
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Add new resource to principal policy
     * @param principalPolicy
     * @param resource The resource to applied. If the value is `*` then the principal policy
     * is applied on all the resources.
     */
    async addResource(
        principalPolicy: PrincipalPolicyKey,
        resource: string | "*",
    ) {
        const { principal_id, entity_name, action_name } = principalPolicy;
        let update, condition;
        condition = {
            principal_id,
            ...(entity_name && { entity_name }),
            ...(action_name && { action_name }),
        };
        if (resource === "*") {
            update = {
                resources: ["*"],
            };
        } else {
            update = {
                $addToSet: { resources: resource },
            };
        }
        const session = await this.principalPolicyModel.db.startSession();
        let result = null;
        try {
            session.startTransaction();
            const {
                n,
                nModified,
                ok,
            } = await this.principalPolicyModel.updateMany(condition, update);
            if (!ok || n !== nModified) {
                result = false;
                await session.abortTransaction();
            } else {
                result = true;
                await session.commitTransaction();
            }
        } catch (err) {
            await session.abortTransaction();
        } finally {
            session.endSession();
            return result;
        }
    }

    /**
     * Remove resource from principal policy
     */
    async removeResource(
        principalPolicy: PrincipalPolicyKey,
        resource: string,
    ) {
        const { principal_id, entity_name, action_name } = principalPolicy;
        const condition = {
            principal_id,
            entity_name,
            ...(action_name && { action_name }),
            resources: resource,
        };
        const session = await this.principalPolicyModel.db.startSession();
        let result = false;
        try {
            session.startTransaction();
            const {
                n,
                nModified,
                ok,
            } = await this.principalPolicyModel.updateMany(condition, {
                $pull: { resources: resource },
            });
            if (!ok || n !== nModified) {
                await session.abortTransaction();
            } else {
                result = true;
                await session.commitTransaction();
            }
        } catch (err) {
            await session.abortTransaction();
        } finally {
            session.endSession();
            return result;
        }
    }

    async findPrincipalById(principalId: string) {
        const principal = await this.principalModel.findOne({
            principal_id: principalId,
        });
        return principal?.toObject() as PrincipalDTO;
    }

    /**
     * Find role policy using name of role and name of entity
     * @param role
     * @param entityName
     */
    async findRolePolicy(role: string, entityName: string) {
        const rolePolicy = await this.rolePolicyModel
            .findOne({
                role_name: role,
                entity_name: entityName,
            })
            .populate({
                path: "entity_policy",
            });
        return rolePolicy?.toObject({ virtuals: true }) as RolePolicyDTO;
    }

    protected async createResourceBasedPrincipalPolicy(
        options: CreatePrincipalPolicyOptions,
    ) {
        try {
            const principalPolicy = await this.principalPolicyModel.create({
                principal_id: options.principal_id,
                entity_name: options.entity_name,
                action_name: options.action_name,
                resources: options.resources,
            });
            return principalPolicy?.toObject() as PrincipalPolicyDTO;
        } catch (err) {
            throw new InvalidPrincipalException();
        }
    }

    protected async createDefaultPrincipalPolicies(
        principal: Principal | PrincipalDTO,
        selfAdded?: boolean,
    ) {
        const rolePolicies = await this.findAllRolePolicies(
            principal.role_name,
        );
        const principalPolicies = [];
        rolePolicies.forEach((rolePolicy) => {
            rolePolicy.entity_policies.forEach((policy) => {
                policy.actions.forEach((action) => {
                    if (action.type === ActionType.role) {
                        return;
                    }
                    const data = {
                        principal_id: principal.principal_id,
                        entity_name: rolePolicy.entity_name,
                        action_name: action.name,
                        resources: selfAdded ? [principal.principal_id] : [],
                    };
                    principalPolicies.push(data);
                });
            });
        });
        try {
            const result = await this.principalPolicyModel.insertMany(
                principalPolicies,
                {
                    ordered: false,
                },
            );
            return result.length === rolePolicies.length;
        } catch (err) {
            return false;
        }
    }

    protected async findAllRolePolicies(role: string) {
        const rolePolicies = await this.rolePolicyModel
            .find({
                role_name: role,
            })
            .populate({
                path: "entity_policies",
            });
        if (rolePolicies.length == 0)
            this.logger.warn(`role ${role} not found or not have any policies`);
        return rolePolicies;
    }

    async persistPrincipal(
        principalId: string,
        roleName: string,
    ): Promise<PrincipalDTO> {
        try {
            const [principal] = await Promise.all([
                this.principalModel.create({
                    principal_id: principalId,
                    role_name: roleName,
                }),
            ]);
            return principal;
        } catch (err) {
            return null;
        }
    }
}
