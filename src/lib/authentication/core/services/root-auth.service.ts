import { Injectable } from "@nestjs/common";
import { LOGIN_STATUSES } from "../consts";
import { RootUserConfig } from "../core.interfaces";
import { UserProfileDTO, AuthUserDTO } from "../dtos";
import { ServiceErrors } from "../utils";
import { BaseAuthUserService } from "./base-auth-user.service";

@Injectable()
export class RootAuthService extends BaseAuthUserService {
    protected readonly DEFAULT_PROFILE_PIC =
        "https://png.pngtree.com/png-clipart/20190520/original/pngtree-user-vector-icon-png-image_3788518.jpg";
    protected readonly DEFAULT_USER_ID = "9021444087";

    async createRootUser(rootUser: RootUserConfig) {
        await this.userModel.findOneAndDelete({
            user_id: this.DEFAULT_USER_ID,
        });
        const userInput = {
            ...rootUser,
            accountType: this.getUserType(),
            isActive: true,
        };
        const [profile, extractedUser, passwordHash] = await Promise.all([
            this.extractProfile(userInput),
            this.extractUser(userInput),
            this.generatePasswordHash(rootUser.password),
        ]);
        const inputDoc = {
            ...extractedUser,
            password: passwordHash,
            login_status: LOGIN_STATUSES.UNLOGINED,
            is_active: true,
            profile,
            type: this.getUserType(),
            roles: ["viewer", "admin"],
            role_id: rootUser.role_id,
        };
        try {
            const user = await this.userModel.create(inputDoc);
            return {
                code: 0,
                data: user,
            };
        } catch (err) {
            this.logger.error(err);
            return ServiceErrors.ServiceErrors;
        }
    }

    getUserType(): string {
        return "local";
    }

    protected extractProfile<User extends RootUserConfig>(
        dto: User,
    ): UserProfileDTO {
        const { username } = dto;
        return {
            first_name: username,
            last_name: username,
            display_name: "Admin",
            profile_pic: this.DEFAULT_PROFILE_PIC,
        };
    }

    protected extractUser<User extends RootUserConfig>(dto: User): AuthUserDTO {
        const { username } = dto;
        return {
            user_id: this.DEFAULT_USER_ID,
            username,
            email: null,
            password_required: true,
            is_active: true,
        };
    }
}
