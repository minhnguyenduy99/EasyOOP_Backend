import { ModuleMetadata, Type } from "@nestjs/common";
import { VerifierDTO } from "./dtos";
export interface IVerificationSender {
    sendVerification(verifier: VerifierDTO): Promise<any>;
    getVerifyMethod(): string;
}
export interface ForFeatureOptions {
    useVerification?: boolean;
}

export interface RootUserConfig {
    username?: string;
    password?: string;
    email?: string;
    role_id?: string;
}
