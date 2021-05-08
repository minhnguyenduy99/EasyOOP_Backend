export interface GoogleAuthConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope: string[];
}

export interface GoogleUser {
    provider?: "google";
    id?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
    picture?: string;
    email_verified?: boolean;
}
