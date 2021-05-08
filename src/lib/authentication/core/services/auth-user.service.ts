import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CloudinaryService } from "src/lib/cloudinary";
import { EncryptService } from "src/lib/encrypt";
import { ServiceResult } from "../dtos";
import { AuthUser } from "../models";
import { ServiceErrors } from "../utils";

export interface IUserService {
    updatePassword(
        userId: string,
        newPassword: string,
    ): Promise<ServiceResult<any>>;
    updateProfile(userId: string, profile: any): Promise<ServiceResult<any>>;
    updateAvatar(
        userOrUserId: string | AuthUser,
        avatar: any,
    ): Promise<ServiceResult<any>>;
}
@Injectable()
export class GlobalAuthUserService {
    constructor(
        @InjectModel(AuthUser.name)
        protected readonly userModel: Model<AuthUser>,
        protected readonly logger: Logger,
        protected encryptService: EncryptService,
        protected imageUploader: CloudinaryService,
    ) {}

    getDefaultRole() {
        return "viewer";
    }

    async getUserByUsernameOrEmail(usernameOrEmail: string) {
        const user = await this.userModel.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        return user;
    }

    async getUserById(userId: string) {
        const user = await this.userModel.findOne({
            user_id: userId,
        });
        return user;
    }

    async getUserByEmail(userEmail: string) {
        const user = await this.userModel.findOne({
            email: userEmail,
        });
        return user;
    }

    async assignRole(userId: string, role: string) {
        try {
            await this.userModel.findOneAndUpdate(
                {
                    user_id: userId,
                },
                {
                    $addToSet: { roles: role },
                },
                {
                    useFindAndModify: false,
                },
            );
            return true;
        } catch (err) {
            this.logger.error(err);
            return false;
        }
    }

    async updateProfile(userOrUserId: string | AuthUser, profile: any) {
        try {
            const user = await this.getUser(userOrUserId);
            if (!user) {
                return ServiceErrors.UserNotFound;
            }
            const updatedProfile = {
                ...user.profile,
                ...profile,
            };
            await user.updateOne({
                profile: updatedProfile,
            });
            return {
                code: 0,
                data: updatedProfile,
            };
        } catch (err) {
            this.logger.verbose(err);
            return {
                code: -2,
                error: err.message,
            };
        }
    }

    async updatePassword(
        userId: string,
        newPassword: string,
    ): Promise<ServiceResult<any>> {
        const user = await this.getUserById(userId);
        if (!user) {
            return ServiceErrors.UserNotFound;
        }
        const hashPassword = await this.encryptService.hash(newPassword);
        try {
            user.password = hashPassword;
            await user.save();
            return {
                code: 0,
            };
        } catch (err) {
            return ServiceErrors.ServiceErrors;
        }
    }

    async updateAvatar(
        userOrUserId: string | AuthUser,
        avatar: any,
    ): Promise<ServiceResult<any>> {
        if (!avatar) {
            return ServiceErrors.MissingAvatarFile;
        }
        const user = await this.getUser(userOrUserId);
        if (!user) {
            return ServiceErrors.UserNotFound;
        }
        const uploadFileResult = await this.imageUploader.uploadFile(avatar, {
            resourceType: "image",
        });
        if (uploadFileResult.error) {
            return ServiceErrors.UpdateAvatarFailed;
        }
        try {
            user.profile.profile_pic = uploadFileResult.url;
            await user.updateOne({
                "profile.profile_pic": uploadFileResult.url,
            });
            return {
                code: 0,
                data: {
                    profile_pic: uploadFileResult.url,
                },
            };
        } catch (err) {
            return ServiceErrors.ServiceErrors;
        }
    }

    protected async getUser(
        userOrUserId?: string | AuthUser,
    ): Promise<AuthUser> {
        if (typeof userOrUserId === "string") {
            return this.getUserById(userOrUserId);
        }
        return userOrUserId;
    }
}
