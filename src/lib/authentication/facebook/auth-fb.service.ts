import { Injectable, Logger, Optional } from "@nestjs/common";
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
import { DetailVerificationFormatter } from "../helpers";
import { MailVerification } from "../verifications/mail-verification";
import { FacebookUser } from "./interfaces";

@Injectable()
export class FacebookUserService extends BaseAuthUserService {
    constructor(
        @Optional() protected readonly verifier: UserVerifier,
        protected mailVerification: MailVerification,
    ) {
        super();
        const formatter = new DetailVerificationFormatter();
        this.mailVerification.useFormatter(formatter);
        this.verifier?.useVerificationSender(this.mailVerification);
    }

    getUserType() {
        return "facebook";
    }

    async createUser(dto: any) {
        const result = await super.createUser(dto);
        return result;
        // if (result.error) {
        //     return result;
        // }
        // const { data: user } = result;
        // try {
        //     this.verifier.createVerify(user);
        // } catch (err) {
        //     this.logger.error(err);
        // } finally {
        //     return result;
        // }
    }

    protected extractProfile<User extends FacebookUser>(
        dto: User,
    ): UserProfileDTO | Promise<UserProfileDTO> {
        const { givenName, familyName } = dto.name;
        return {
            first_name: familyName,
            last_name: givenName,
            display_name: dto.displayName,
            profile_pic: dto.photos?.[0]?.value,
        };
    }

    protected extractUser<User extends FacebookUser>(
        dto: User,
    ): AuthUserDTO | Promise<AuthUserDTO> {
        return {
            user_id: dto.id,
            username: dto.id,
            type: "facebook",
            email: dto.emails?.[0]?.value,
        };
    }
}
