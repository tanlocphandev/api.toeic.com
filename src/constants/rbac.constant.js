// Access Control List Actions
const CREATE_ANY = "createAny";
const CREATE_OWN = "createOwn";

const READ_ANY = "readAny";
const READ_OWN = "readOwn";

const UPDATE_OWN = "updateOwn";
const UPDATE_ANY = "updateAny";

const DELETE_ANY = "deleteAny";
const DELETE_OWN = "deleteOwn";

// Grant Actions
const GRANT_ACTIONS = {
    CREATE_ANY: "create:any",
    CREATE_OWN: "create:own",

    READ_ANY: "read:any",
    READ_OWN: "read:own",

    UPDATE_OWN: "update:own",
    UPDATE_ANY: "update:any",

    DELETE_ANY: "delete:any",
    DELETE_OWN: "delete:own",
};

module.exports = {
    CREATE_ANY,
    CREATE_OWN,
    READ_ANY,
    READ_OWN,
    UPDATE_OWN,
    UPDATE_ANY,
    DELETE_ANY,
    DELETE_OWN,
    GRANT_ACTIONS,
};
