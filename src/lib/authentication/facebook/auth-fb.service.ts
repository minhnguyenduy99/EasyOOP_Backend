import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    AuthenticationCoreService,
    AuthUser,
    UserProfileDTO,
    AuthUserDTO,
    UserVerifier,
} from "../core";
import { DetailVerificationFormatter } from "../helpers";
import { MailVerification } from "../verifications/mail-verification";
import { VERIFICATION_ENDPOINT } from "./consts";
import { FacebookUser } from "./interfaces";

@Injectable()
export class AuthFacebookService extends AuthenticationCoreService {
    constructor(
        @InjectModel(AuthUser.name)
        protected readonly userModel: Model<AuthUser>,
        protected readonly logger: Logger,
        protected readonly verifier: UserVerifier,
        protected mailVerification: MailVerification,
        configService: ConfigService,
    ) {
        super(userModel, logger);
        const formatter = new DetailVerificationFormatter(
            configService.get(VERIFICATION_ENDPOINT),
        );
        this.mailVerification.useFormatter(formatter);
        this.verifier.useVerificationSender(this.mailVerification);
    }

    async createUser(dto: any) {
        const result = await super.createUser(dto);
        if (result.error) {
            return result;
        }
        const { data: user } = result;
        try {
            this.verifier.createVerify(user);
        } catch (err) {
            this.logger.error(err);
        } finally {
            return result;
        }
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
