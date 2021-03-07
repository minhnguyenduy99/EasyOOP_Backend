import { ModuleMetadata } from "@nestjs/common";
import { AuthDataHandler } from "./auth-data-handler";

/**
 * A custom option to dynamically provide roles
 */
export interface AuthRoleProvider extends Pick<ModuleMetadata, "imports"> {
    inject?: any[];
    useFactory: (...args: any[]) => string[] | Promise<string[]>;
}

/**
 * Options applied to the authorization core module
 */
export interface AuthCoreRootOptions {
    /**
     * The list of roles to provide for the application
     */
    roles?: string[] | AuthRoleProvider;

    authDataHandler?: AuthDataHandler;
}
