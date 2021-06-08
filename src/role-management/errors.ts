export const ERRORS = {
    RoleNotFound: {
        code: -1,
        errorType: "RoleManagement.RoleNotFound",
        error: "Role not found",
    },
    InvalidUser: {
        code: -2,
        errorType: "RoleManagement.InvalidUser",
        error: "User ID is invalid",
    },
    InvalidRoleType: {
        code: -3,
        errorType: "RoleManagement.InvalidRoleType",
        error: "Invalid role type",
    },
    RoleHasBeenAssigned: {
        code: -4,
        errorType: "RoleManagement.RoleHasBeenAssigned",
        error: "Role has been assigned to user",
    },
    UserNotFound: {
        code: -5,
        errorType: "RoleManagement.UserNotFound",
        error: "User not found",
    },
    ServieErrors: {
        code: -10,
        errorType: "RoleManagement.ServiceError",
        error: "Service Error",
    },
};
