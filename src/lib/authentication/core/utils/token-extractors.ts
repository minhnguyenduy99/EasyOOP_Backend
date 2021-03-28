import { ExtractJwt } from "passport-jwt";
import { REQUEST_KEYS } from "../consts";

export const AccessTokenExtractor = ExtractJwt.fromExtractors([
    ExtractJwt.fromAuthHeaderAsBearerToken(),
    (req) => req.cookies[REQUEST_KEYS.ACCESS_TOKEN_COOKIE],
]);

export const RefreshTokenExtractor = (req) =>
    req.cookies[REQUEST_KEYS.REFRESH_TOKEN_COOKIE];
