import { ExtractJwt } from "passport-jwt";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./consts";

export const AccessTokenExtractor = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.cookies[ACCESS_TOKEN_COOKIE],
]);

export const RefreshTokenExtractor = (req) => req.cookies[REFRESH_TOKEN_COOKIE];
