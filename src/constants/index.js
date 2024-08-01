const USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
    TEACHER: "teacher",
};

const HEADERS = {
    AUTHORIZATION: "authorization",
    REFRESH_TOKEN: "refresh-token",
    X_CLIENT_ID: "x-client-id",
    LOGOUT: "logout",
    CONTENT_TYPE: "Content-Type",
    SHOULD_LOGOUT: "x-required-logout",
};

const EXAM_TYPES = {
    FULL_TEST: "FULL_TEST",
    ONE_TEST: "ONE_TEST",
};

module.exports = {
    USER_ROLES,
    HEADERS,
    EXAM_TYPES,
};
