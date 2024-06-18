"use strict";

const { HEADERS } = require("../constants");

const corsConfig = {
    origin: process.env.CLIENT_ENDPOINT,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: [
        HEADERS.CONTENT_TYPE,
        HEADERS.AUTHORIZATION,
        HEADERS.REFRESH_TOKEN,
        HEADERS.X_CLIENT_ID,
        HEADERS.LOGOUT,
    ],
    exposedHeaders: [HEADERS.SHOULD_LOGOUT],
};

module.exports = corsConfig;
