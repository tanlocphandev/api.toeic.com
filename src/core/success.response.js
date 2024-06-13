"use strict";

const ReasonStatusCode = require("./reasonPhrases.core");
const StatusCode = require("./statusCodes.core");

/**
 * Represents a response indicating success.
 *
 * @param {Object} options - The options for the response.
 * @param {string} [options.message=""] - The message for the response.
 * @param {StatusCode} [options.statusCode=StatusCode.OK] - The status code for the response.
 * @param {ReasonStatusCode} [options.reasonCode=ReasonStatusCode.OK] - The reason code for the response.
 * @param {Object} [options.metadata={}] - The metadata for the response.
 */
class SuccessResponse {
    constructor({
        message = "",
        statusCode = StatusCode.OK,
        reasonCode = ReasonStatusCode.OK,
        metadata = {},
    }) {
        this.message = message ?? reasonCode;
        this.status = statusCode;
        this.metadata = metadata;
    }

    /**
     * Sends the response.
     *
     * @param {Object} res - The response object.
     * @param {Object} [headers={}] - The headers for the response.
     * @return {Object} The JSON response.
     */
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

/**
 * Represents a successful response with a status code of 200 OK.
 *
 * @param {Object} options - The options for the response.
 * @param {string} [options.message=""] - The message for the response.
 * @param {Object} [options.metadata={}] - The metadata for the response.
 */
class OK extends SuccessResponse {
    constructor({ message = "", metadata = {} }) {
        super({ message, metadata });
    }
}

/**
 * Represents a successful response with a status code of 201 Created.
 *
 * @param {Object} options - The options for the response.
 * @param {string} [options.message=""] - The message for the response.
 * @param {Object} [options.metadata={}] - The metadata for the response.
 * @param {Object} [options.options={}] - Additional options for the response.
 */
class Created extends SuccessResponse {
    /**
     * Creates a new instance of Created.
     *
     * @param {Object} options - The options for the response.
     * @param {string} [options.message=""] - The message for the response.
     * @param {Object} [options.metadata={}] - The metadata for the response.
     * @param {Object} [options.options={}] - Additional options for the response.
     */
    constructor({
        message = "",
        statusCode = StatusCode.CREATED,
        reasonCode = ReasonStatusCode.CREATED,
        metadata = {},
        options = {},
    }) {
        super({ message, metadata, reasonCode, statusCode });
        this.options = options;
    }
}

module.exports = {
    OK,
    Created,
};
