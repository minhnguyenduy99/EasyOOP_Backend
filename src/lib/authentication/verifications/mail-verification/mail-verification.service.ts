import { Inject, Injectable, Logger } from "@nestjs/common";
import { IVerificationSender, VerifierDTO } from "../../core";
import { createTransport } from "nodemailer";
import { MAIL_SERVICE_CONFIG, TRANSPORTER_CONFIG } from "./consts";
import {
    IHTMLFormatter,
    MailServiceConfig,
    TransporterConfig,
} from "./interfaces";

@Injectable()
export class MailVerification implements IVerificationSender {
    private readonly transporter: any;
    private htmlFormatter: IHTMLFormatter<VerifierDTO>;

    constructor(
        @Inject(TRANSPORTER_CONFIG) transporterConfig: TransporterConfig,
        @Inject(MAIL_SERVICE_CONFIG)
        private readonly mailConfig: MailServiceConfig,
        private readonly logger: Logger,
    ) {
        this.transporter = createTransport(transporterConfig);
        this.logger.verbose(transporterConfig, "TransporterConfig");
        this.logger.verbose(mailConfig, "mailConfig");
    }

    getVerifyMethod() {
        return "email";
    }

    useFormatter(formatter: IHTMLFormatter<VerifierDTO>) {
        this.htmlFormatter = formatter;
    }

    async sendVerification(verifier: VerifierDTO): Promise<any> {
        if (!verifier) {
            return false;
        }
        const htmlContent = await this.htmlFormatter?.format(verifier);
        const { user } = verifier;
        this.logger.verbose("Send verification email: " + user.email);
        try {
            let info = await this.transporter.sendMail({
                from: "localhost:3000@email.com",
                to: user.email,
                subject: this.mailConfig.defaultSubject,
                html: htmlContent,
            });
            this.logger.verbose(info);
            return {
                code: 0,
                data: info,
            };
        } catch (err) {
            this.logger.error(err);
            return {
                code: -1,
                error: err,
            };
        }
    }
}
