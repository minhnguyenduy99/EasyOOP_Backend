import { IHTMLFormatter } from "../verifications/mail-verification";

export class DetailVerificationFormatter implements IHTMLFormatter<string> {
    format(verifyURL: string): string | Promise<string> {
        return `
            <p>Click the link below to verify your registration:</p>
            <a href="${verifyURL}">${verifyURL}</a>
        `;
    }
}
