import { AuthUserDTO } from "../../auth-local";

export interface CreateVerifierDTO {
    expired_in?: number;
}

export interface VerifierDTO {
    user?: AuthUserDTO;
    user_id?: string;
    verify_method?: string;
    verify_code?: string;
    expired_in?: number;
}
