export interface ForRootModuleOptions
    extends Pick<FacebookAppConfig, "callbackURL" | "scope" | "profileFields"> {
    useVerification?: boolean;
}

export interface FacebookAppConfig {
    clientID?: string;
    clientSecret?: string;
    callbackURL?: string;
    scope?: string;
    profileFields?: string[];
}

export interface FacebookUser {
    id?: string;
    displayName?: string;
    name?: {
        familyName?: string;
        givenName?: string;
        middleName?: string;
    };
    photos?: {
        value: string;
    }[];
    emails?: {
        value: string;
        type: string;
    }[];
}
