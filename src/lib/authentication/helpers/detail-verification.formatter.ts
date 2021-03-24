import { VerifierDTO } from "../core";
import { IHTMLFormatter } from "../verifications/mail-verification";

export class DetailVerificationFormatter
    implements IHTMLFormatter<VerifierDTO> {
    constructor(private readonly verifyEndpoint: string) {}

    format(data: VerifierDTO): string | Promise<string> {
        const verifyURL = this.generateVerifyURL(data);
        return `
            <p>Click the link below to verify your registration:</p>
            <a href="${verifyURL}">${verifyURL}</a>
        `;
    }

    protected generateVerifyURL(data: VerifierDTO) {
        return `${this.verifyEndpoint}?user_id=${data.user_id}&code=${data.verify_code}`;
    }
}
