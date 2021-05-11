import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "eventemitter2";
import { Model } from "mongoose";
import { CreateCreatorDTO } from "../dtos/creator";
import { ROLE_EVENTS } from "../events";
import { ROLES } from "../helpers";
import { Creator } from "../models";
import { ServiceResult } from "./interfaces";
import { BaseRoleService } from "./role.service";

@Injectable()
export class CreatorService extends BaseRoleService {
    constructor(
        @InjectModel(Creator.name) roleModel: Model<Creator>,
        moduleRef: ModuleRef,
        protected eventEmitter: EventEmitter2,
    ) {
        super(roleModel, moduleRef);
    }

    protected getRole(): string {
        return ROLES.creator;
    }

    async createCreator(
        userId: string,
        dto: CreateCreatorDTO,
    ): Promise<ServiceResult<Creator>> {
        dto["user_id"] = userId;
        const result = await this.create(dto);
        if (result.error) {
            return result;
        }
        this.eventEmitter.emitAsync(ROLE_EVENTS.ROLE_CREATED, {
            role: result.data,
            roleType: ROLES.creator,
        });
        return result;
    }

    getCreatorById(creatorId: string) {
        return this.findById(creatorId, {
            groups: ["user"],
        });
    }
}
