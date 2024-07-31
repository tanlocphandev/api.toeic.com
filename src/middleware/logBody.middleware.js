"use strict";

const _ = require("lodash");

const logBody = (req, res, next) => {
    if (!_.isEmpty(req.body)) {
        console.log("====================================");
        console.log(`[req.body]:::`, JSON.stringify(req.body, null, 2));
        console.log("====================================");
    }

    next();
};

module.exports = { logBody };
