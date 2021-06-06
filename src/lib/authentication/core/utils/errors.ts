export default {
    InvalidAuthInfo: {
        code: -1,
        errorType: "Authentication.InvalidAuthInfo",
        error: "Invalid usernamr or password",
    },
    UsernameOrEmailDuplication: {
        code: -2,
        errorType: "Authentication.DuplicateInfo",
        error: "Username or email already exists",
    },
    UserNotFound: {
        code: -5,
        errorType: "Authentication.UserNotFound",
        error: "User not found",
    },
    UpdateAvatarFailed: {
        code: -9,
        errorType: "Authentication.UpdateAvatarFailed",
        error: "Get error when updating avatar",
    },
    MissingAvatarFile: {
        code: -8,
        errorType: "Authentication.MissingAvatarFile",
        error: "Missing avatar file",
    },
    ServiceErrors: {
        code: -10,
        errorType: "Authentication.ServiceError",
        error: "Service error",
    },
};
