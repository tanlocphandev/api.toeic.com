"use strict";

const ReasonStatusCode = require("./reasonPhrases.core");
const StatusCode = require("./statusCodes.core");

class ErrorResponse extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.BAD_REQUEST,
        status = StatusCode.BAD_REQUEST,
        details = null
    ) {
        super(message, status, details);
    }
}

class NotfoundRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.NOT_FOUND, status = StatusCode.NOT_FOUND) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStatusCode.UNAUTHORIZED, status = StatusCode.UNAUTHORIZED) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonStatusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status);
    }
}

class ServerError extends ErrorResponse {
    constructor(
        message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
        status = StatusCode.INTERNAL_SERVER_ERROR
    ) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    NotfoundRequestError,
    AuthFailureError,
    ForbiddenError,
    ServerError,
};
