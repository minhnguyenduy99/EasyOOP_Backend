import { Injectable, Logger } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EncryptService } from "src/lib/encrypt";
import {
    BaseAuthUserService,
    AuthUser,
    UserProfileDTO,
    AuthUserDTO,
    UserVerifier,
} from "../core";
import { GoogleUser } from "./interfaces";

@Injectable()
export class GoogleUserService extends BaseAuthUserService {
    constructor() {
        super();
    }

    getUserType() {
        return "google";
    }

    async createUser(dto: any) {
        return super.createUser({
            ...dto,
            isActive: true,
        });
    }

    protected extractProfile<User extends GoogleUser>(
        dto: User,
    ): UserProfileDTO | Promise<UserProfileDTO> {
        const { given_name, family_name, displayName, picture } = dto;
        return {
            first_name: family_name,
            last_name: given_name,
            display_name: displayName,
            profile_pic: picture,
        };
    }

    protected extractUser<User extends GoogleUser>(
        dto: User,
    ): AuthUserDTO | Promise<AuthUserDTO> {
        return {
            user_id: dto.id,
            username: dto.id,
            type: dto.provider,
            email: dto.email,
        };
    }
}
