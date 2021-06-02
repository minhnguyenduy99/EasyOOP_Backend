import { REQUEST_KEYS } from "../consts";
import { AuthInfo } from "../interfaces";

export const AccessTokenExtractor = (req) =>
    req.cookies[REQUEST_KEYS.ACCESS_TOKEN_COOKIE];

export const InjectAccessToken = (req, accessToken) =>
    (req.cookies[REQUEST_KEYS.ACCESS_TOKEN_COOKIE] = accessToken);

export const RefreshTokenExtractor = (req) =>
    req.cookies[REQUEST_KEYS.REFRESH_TOKEN_COOKIE];

export const RoleIdExtractor = (req) => req.cookies[REQUEST_KEYS.ROLE_COOKIE];

export const SetAuthInfo = (req, authInfo: AuthInfo) => {
    const { accessToken, roleId } = authInfo;
    req[REQUEST_KEYS.AUTH_INFO] = {
        ...(accessToken && { accessToken }),
        ...(roleId && { roleId }),
    };
};

export const GetAuthInfo = (req) => req[REQUEST_KEYS.AUTH_INFO] as AuthInfo;
