import { REQUEST_KEYS } from "../consts";

export const AccessTokenExtractor = (req) =>
    req.cookies[REQUEST_KEYS.ACCESS_TOKEN_COOKIE];

export const RefreshTokenExtractor = (req) =>
    req.cookies[REQUEST_KEYS.REFRESH_TOKEN_COOKIE];

export const RoleIdExtractor = (req) => req.cookies[REQUEST_KEYS.ROLE_COOKIE];

export const SetAuthToken = (req, { accessToken, refreshToken }) => {
    req[REQUEST_KEYS.AUTH_TOKEN] = {
        accessToken,
        refreshToken,
    };
};

export const GetAuthToken = (req) => req[REQUEST_KEYS.AUTH_TOKEN];

export const SetAuthUser = (req, field, user) => {
    req[field] = user;
};
