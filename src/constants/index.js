const USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
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

// Access Control List Actions
const CREATE_ANY = "createAny";
const CREATE_OWN = "createOwn";

const READ_ANY = "readAny";
const READ_OWN = "readOwn";

const UPDATE_OWN = "updateOwn";
const UPDATE_ANY = "updateAny";

const DELETE_ANY = "deleteAny";
const DELETE_OWN = "deleteOwn";

module.exports = {
    USER_ROLES,
    HEADERS,
    EXAM_TYPES,
    CREATE_ANY,
    CREATE_OWN,
    READ_ANY,
    READ_OWN,
    UPDATE_OWN,
    UPDATE_ANY,
    DELETE_ANY,
    DELETE_OWN,
};
