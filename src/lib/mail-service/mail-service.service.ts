import { Inject, Injectable, Logger } from "@nestjs/common";
import { CONFIG_KEY } from "./consts";
import { MailServiceConfig, SendMailOptions } from "./interfaces";
import { post as requestPost } from "superagent";

@Injectable()
export class MailService {
    constructor(
        @Inject(CONFIG_KEY) private readonly config: MailServiceConfig,
        private readonly logger: Logger,
    ) {}

    async sendEmail(input: SendMailOptions) {
        try {
            const response = await requestPost(this.config.requestUrl).send(
                input,
            );
            const { code, error } = response.body as any;
            return {
                code,
                error,
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
