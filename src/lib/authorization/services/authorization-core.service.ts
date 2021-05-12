import {
    Inject,
    Injectable,
    Logger,
    OnApplicationBootstrap,
    OnModuleInit,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ActionType, MODULE_KEYS } from "../consts";
import { RolePolicyAssign, EntityPolicyDefinition } from "../interfaces";
import { RolePolicy, Role, EntityPolicy, RoleActionPolicy } from "../models";

@Injectable()
export class AuthorizationCoreService {
    protected isClean: boolean;
    protected policyAssigns: RolePolicyAssign;
    protected roles: string[];
    protected policies: EntityPolicyDefinition[];

    protected roleSet: any;

    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<Role>,
        @InjectModel(RolePolicy.name)
        private readonly rolePolicyModel: Model<RolePolicy>,
        @InjectModel(EntityPolicy.name)
        private readonly entityPolicyModel: Model<EntityPolicy>,
        @InjectModel(RoleActionPolicy.name)
        private readonly roleActionPolicyModel: Model<RoleActionPolicy>,
        @Inject(MODULE_KEYS.LOGGER) private readonly logger: Logger,
    ) {
        this.isClean = false;
        this.policies = [];
        this.policyAssigns = {};
        this.roles = [];
        this.roleSet = {};
    }

    get allRoles() {
        return this.roleSet;
    }

    async sync() {
        const session = await this.roleModel.db.startSession();
        try {
            session.startTransaction();
            await Promise.all([
                this.syncRoles(),
                this.syncEntityPolicies(),
                this.syncRolePolicies(),
            ]);
            await this.syncRoleActionPolicies();
            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            this.logger.error(err.stack);
        } finally {
            session.endSession();
        }
    }

    async clean() {
        if (this.isClean) {
            return;
        }
        await Promise.all([
            this.rolePolicyModel.deleteMany({}),
            this.roleModel.deleteMany({}),
            this.entityPolicyModel.deleteMany({}),
            this.roleActionPolicyModel.deleteMany({}),
        ]);
        this.isClean = true;
    }

    setRoles(roles: Set<string>) {
        roles.forEach((value) => {
            this.roles.push(value as string);
            this.roleSet[value as string] = value as string;
        });
    }

    addNewEntityPolicies(policies: EntityPolicyDefinition[]) {
        this.policies.push(...policies);
    }

    assignPoliciesToRole(assign: RolePolicyAssign) {
        Object.keys(assign).map((role) => {
            const listRoleAssigns = this.policyAssigns[role];
            if (!listRoleAssigns) {
                this.policyAssigns[role] = [];
            }
            this.policyAssigns[role].push(...assign[role]);
        });
    }

    protected async syncRoles() {
        const data = this.roles.map((role) => ({
            role_name: role,
        }));
        const result = await this.roleModel.insertMany(data, {
            ordered: false,
        });
        this.logger.log("Sync roles: " + result.length);
    }

    protected async syncEntityPolicies() {
        this.policies.forEach((policy) => {
            const actions = policy.actions;
            policy.actions = actions.map((action) => {
                if (typeof action === "string") {
                    return { name: action, type: ActionType.role };
                }
                return { name: action["name"], type: action["type"] };
            });
        });
        const data = this.policies.map((policy) => ({
            policy_name: policy.policyName,
            entity_name: policy.entity,
            actions: policy.actions,
        }));
        const result = await this.entityPolicyModel.insertMany(data, {
            ordered: false,
        });
        this.logger.log("Sync entity policies: " + result.length);
    }

    protected async syncRolePolicies() {
        let data = [];
        Object.keys(this.policyAssigns).forEach((role) => {
            const eachRoleAssigns = this.policyAssigns[role];
            eachRoleAssigns.forEach((assign) => {
                const { entity, policies } = assign;
                data.push({
                    role_name: role,
                    entity_name: entity,
                    entity_policy_names: policies,
                });
            });
        });

        let rolePolicies = [];
        data.forEach((roleGroup) => {
            rolePolicies = rolePolicies.concat(roleGroup);
        });

        try {
            const result = await this.rolePolicyModel.insertMany(rolePolicies, {
                ordered: false,
            });
            this.logger.log("Sync role policies: " + result.length);
        } catch (err) {
            this.logger.error(err);
        }
    }

    protected async syncRoleActionPolicies() {
        const rolePolicies = await this.rolePolicyModel
            .find()
            .populate("entity_policies");
        const roleActionPolicies = [];
        rolePolicies.forEach((rolePolicy) => {
            rolePolicy.entity_policies.forEach((entityPolicy) => {
                entityPolicy.actions.forEach(({ name, type }) => {
                    if (type === ActionType.resource) {
                        return;
                    }
                    roleActionPolicies.push({
                        role_name: rolePolicy.role_name,
                        entity_name: rolePolicy.entity_name,
                        action_name: name,
                    });
                });
            });
        });
        const result = await this.roleActionPolicyModel.insertMany(
            roleActionPolicies,
            {
                ordered: false,
            },
        );
        if (result.length !== roleActionPolicies.length) {
            throw new Error("Sync role action policies error");
        }
    }
}
