import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model } from "mongoose";
import { AssignManagerDTO } from "../dtos/manager";
import { ROLE_EVENTS } from "../events";
import { ROLES } from "../helpers";
import { Manager } from "../models";
import { ServiceResult } from "./interfaces";
import { BaseRoleService } from "./role.service";

@Injectable()
export class ManagerService extends BaseRoleService {
    constructor(
        @InjectModel(Manager.name) roleModel: Model<Manager>,
        moduleRef: ModuleRef,
        protected eventEmitter: EventEmitter2,
    ) {
        super(roleModel, moduleRef);
    }

    protected getRole(): string {
        return ROLES.manager;
    }

    async assignManager(
        userId: string,
        dto: AssignManagerDTO,
    ): Promise<ServiceResult<Manager>> {
        dto["user_id"] = userId;
        const result = await this.create(dto);
        if (result.error) {
            return result;
        }
        this.eventEmitter.emitAsync(ROLE_EVENTS.ROLE_CREATED, {
            role: result.data,
            roleType: ROLES.manager,
        });
        return result;
    }

    getManagerById(managerId: string) {
        return this.findById(managerId);
    }
}
