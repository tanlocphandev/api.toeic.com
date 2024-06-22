"use strict";

const { NotfoundRequestError } = require("../core/error.response");
const FileLib = require("../libs/file.lib");

const catchNotFound = (_req, _res, next) => {
    const notFoundError = new NotfoundRequestError("Not Found!");
    next(notFoundError);
};

const catchError = (err, req, res, _next) => {
    const statusCode = err.status || 500;

    // Check if exist file request
    if (req.file) {
        FileLib.deleteFile(req.file.path);
    }

    res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: err.message || "Internal Server Error!",
        details: err?.details || null,
        stack: err.stack,
    });
};

module.exports = { catchNotFound, catchError };
