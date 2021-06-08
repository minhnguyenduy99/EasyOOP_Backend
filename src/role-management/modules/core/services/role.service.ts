import { Inject, Logger, OnModuleInit, Type } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Model } from "mongoose";
import { GlobalAuthUserService } from "src/lib/authentication/core";
import { ERRORS } from "../../../errors";
import { SearchRolesDTO } from "../dtos";
import { QueryOptions, ServiceResult } from "./interfaces";
import { RoleServiceHelper } from "./role-service-helper";

const DEFAULT_RESULT_PER_PAGE = 6;

export abstract class BaseRoleService implements OnModuleInit {
    protected serviceHelper: RoleServiceHelper;
    protected logger?: Logger;

    @Inject(GlobalAuthUserService)
    protected userAuthService: GlobalAuthUserService;

    constructor(
        protected roleModel: Model<any>,
        private moduleRef: ModuleRef,
    ) {}

    async onModuleInit() {
        this.serviceHelper = this.moduleRef.get(RoleServiceHelper);
        this.logger = this.moduleRef.get(Logger);
    }

    async getByUserId(
        userId: string,
        queryOptions?: QueryOptions,
    ): Promise<any> {
        const { groups } = queryOptions;
        this.serviceHelper.filterByUserId(userId).group(groups);
        const result = await this.roleModel.aggregate(
            this.serviceHelper.build(),
        );
        return result?.[0];
    }

    protected async create(data: any): Promise<ServiceResult<any>> {
        const { user_id } = data;
        const user = await this.userAuthService.getUserById(user_id);
        if (!user) {
            return ERRORS.InvalidUser;
        }
        if (user.roles.indexOf(this.getRole()) !== -1) {
            return ERRORS.RoleHasBeenAssigned;
        }
        data.alias = data.alias ?? user.profile.last_name;
        try {
            const result = await this.roleModel.create(data);
            return {
                code: 0,
                data: result,
            };
        } catch (err) {
            this.logger?.error(err);
            return ERRORS.ServieErrors;
        }
    }

    protected async findById(id: string, queryOptions?: QueryOptions) {
        const { groups = [] } = queryOptions ?? {};
        this.serviceHelper.filterByRoleId(id).group(groups);
        const result = await this.roleModel.aggregate(
            this.serviceHelper.build(),
        );
        return result?.[0];
    }

    async findRoles(
        searchOptions?: SearchRolesDTO,
        queryOptions?: QueryOptions,
    ) {
        const { alias, sort_by, sort_order } = searchOptions;
        const { groups = [], page = 1 } = queryOptions ?? {};
        const query = this.serviceHelper
            .filter(alias)
            .group(groups)
            .sort({ sort_by, sort_order })
            .limit({
                start: (page - 1) * DEFAULT_RESULT_PER_PAGE,
                count: DEFAULT_RESULT_PER_PAGE,
            })
            .build();
        const [{ results, count }] = await this.roleModel.aggregate(query);
        return {
            results,
            count,
        };
    }

    async update<DTO>(roleId: string, dto: DTO): Promise<ServiceResult<any>> {
        const role = await this.roleModel.findOne({
            role_id: roleId,
        });
        if (!role) {
            return ERRORS.RoleNotFound;
        }
        try {
            await role.updateOne(dto);
            return {
                code: 0,
                data: role,
            };
        } catch (err) {
            this.logger.error(err);
            return ERRORS.ServieErrors;
        }
    }

    protected abstract getRole(): string;
}
