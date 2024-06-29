"use strict";

const { HEADERS } = require("../constants");
const { AuthFailureError, ForbiddenError } = require("../core/error.response");
const asyncHandler = require("../helpers/asyncHandler.helper");
const { verifyToken } = require("../helpers/auth.helper");
const KeyTokenService = require("../services/keyToken.service");

/**
 * Middleware function to authenticate the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the authentication is complete.
 * @throws {AuthFailureError} - If the authentication fails.
 */
const authentication = asyncHandler(async (req, res, next) => {
    // Get the client ID from the headers
    const clientId = req.headers[HEADERS.X_CLIENT_ID]?.toString();

    // Check if the client ID is missing
    if (!clientId) {
        throw new AuthFailureError(`Missing ${HEADERS.X_CLIENT_ID} headers!`);
    }

    // Find the key store token in the database by client ID
    const foundKeyStore = await KeyTokenService.findByUserId(clientId);

    // Check if the key store is not found
    if (!foundKeyStore) {
        // Remove all tokens
        res.setHeader(HEADERS.SHOULD_LOGOUT, "true");
        throw new AuthFailureError("Key store not found!");
    }

    // Check if exist headers logout
    if (req.headers[HEADERS.LOGOUT]?.toString()) {
        const logoutClientId = req.headers[HEADERS.LOGOUT];

        if (logoutClientId !== clientId) {
            throw new AuthFailureError("Invalid logout client id!");
        }

        req.keyStore = foundKeyStore;
        return next();
    }

    // Check if refresh token exists
    if (req.headers[HEADERS.REFRESH_TOKEN]?.toString()) {
        const refreshToken = req.headers[HEADERS.REFRESH_TOKEN];

        // Verify the refresh token
        try {
            const decode = await verifyToken(refreshToken, foundKeyStore.private_key);

            // Check if the user ID matches the client ID
            if (decode.userId !== +clientId) {
                throw new AuthFailureError("Invalid user!");
            }

            // Set the user, key store, and refresh token to the request object
            req.user = decode;
            req.keyStore = foundKeyStore;
            req.refreshToken = refreshToken;
            return next();
        } catch (error) {
            if (error.message === "jwt expired") {
                // Remove all tokens
                res.setHeader(HEADERS.SHOULD_LOGOUT, "true");
                await KeyTokenService.removeById(foundKeyStore.key_id);
            }

            throw new AuthFailureError(error.message);
        }
    }

    // Check if the access token is missing
    let accessToken = req.headers[HEADERS.AUTHORIZATION]?.toString();

    if (!accessToken) {
        throw new AuthFailureError("Missing access token!");
    }

    // Extract the access token from the authorization header
    accessToken = accessToken.split(" ")[1];

    // Verify the access token
    const decode = await verifyToken(accessToken, foundKeyStore.public_key);

    // Check if the user ID matches the client ID
    if (decode.userId !== +clientId) {
        throw new AuthFailureError("Invalid user!");
    }

    // Set the user and key store to the request object
    req.user = decode;
    req.keyStore = foundKeyStore;

    next();
});

/**
 * Middleware function that checks if the user's role is included in the specified roles.
 *
 * @param {Array<string>} roles - An array of roles to check against the user's role.
 * @return {Function} - An async handler function that checks the user's role and throws a ForbiddenError if the user's role is not included in the specified roles.
 */
const checkRoles = (roles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { user } = req;

        if (!roles.includes(user.role)) {
            throw new ForbiddenError("Bạn không được phép truy cập!");
        }

        return next();
    });
};

module.exports = { authentication, checkRoles };
