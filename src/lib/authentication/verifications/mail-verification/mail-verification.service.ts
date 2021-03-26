import { Inject, Injectable, Logger } from "@nestjs/common";
import { MailService } from "src/lib/mail-service";
import { IVerificationSender, VerifierDTO } from "../../core";
import { MAIL_SERVICE_CONFIG } from "./consts";
import { IHTMLFormatter, MailServiceConfigOptions } from "./interfaces";

@Injectable()
export class MailVerification implements IVerificationSender {
    private htmlFormatter: IHTMLFormatter<string>;

    constructor(
        @Inject(MAIL_SERVICE_CONFIG)
        private readonly mailConfig: MailServiceConfigOptions,
        private readonly mailService: MailService,
        private readonly logger: Logger,
    ) {}

    getVerifyMethod() {
        return "email";
    }

    useFormatter(formatter: IHTMLFormatter<string>) {
        this.htmlFormatter = formatter;
    }

    async sendVerification(verifier: VerifierDTO): Promise<any> {
        if (!verifier) {
            return false;
        }
        const verifyURL = this.generateVerificationURL(verifier);
        const htmlContent = await this.htmlFormatter?.format(verifyURL);
        const { user } = verifier;
        this.logger.verbose("Send verification email: " + user.email);
        try {
            let result = await this.mailService.sendEmail({
                toEmail: user.email,
                subject: this.mailConfig.defaultSubject,
                content: htmlContent,
            });
            return result;
        } catch (err) {
            this.logger.error(err);
            return {
                code: -1,
                error: err,
            };
        }
    }

    protected generateVerificationURL(verifier: VerifierDTO) {
        const { user_id, verify_code } = verifier;
        return `${this.mailConfig.endpoint}?user-id=${user_id}&code=${verify_code}`;
    }
}
