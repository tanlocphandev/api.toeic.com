"use strict";

const AccessControl = require("accesscontrol");

// grant list fetched from DB (to be converted to a valid grants object, internally)
let grantList = [
    { role: "admin", resource: "comment", action: "create:any", attributes: "*" },
    { role: "user", resource: "comment", action: "read:any", attributes: "*" },
    { role: "admin", resource: "comment", action: "read:any", attributes: "*" },
];

module.exports = new AccessControl(grantList);
