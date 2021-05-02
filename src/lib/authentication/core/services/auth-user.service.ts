import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthUser } from "../models";

@Injectable()
export class GlobalAuthUserService {
    constructor(
        @InjectModel(AuthUser.name)
        protected readonly userModel: Model<AuthUser>,
        protected readonly logger: Logger,
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
}
