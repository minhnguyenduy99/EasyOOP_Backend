import { Injectable } from "@nestjs/common";
import { AuthUserDTO, BaseAuthUserService, UserProfileDTO } from "../../core";
import { GoogleUser } from "../interfaces";

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
        const { given_name, family_name, picture } = dto;
        return {
            first_name: family_name,
            last_name: given_name,
            display_name: `${family_name} ${given_name}`,
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
