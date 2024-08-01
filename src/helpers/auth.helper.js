"use strict";

const JWT = require("jsonwebtoken");
const { AuthFailureError } = require("../core/error.response");

const { EXPIRED_ACCESS_TOKEN, EXPIRED_REFRESH_TOKEN } = process.env;

/**
 * Creates a token pair consisting of an access token and a refresh token.
 *
 * @param {Object} payload - The payload to be included in the tokens.
 * @param {string} publicKey - The public key used to sign the access token.
 * @param {string} privateKey - The private key used to sign the refresh token.
 * @return {Promise<{ accessToken: string; refreshToken: string }>} An object containing the access token and the refresh token.
 */
const createTokenPair = async ({
    payload,
    publicKey,
    privateKey,
    expiresInAccessToken = EXPIRED_ACCESS_TOKEN || "2 days",
    expiresInRefreshToken = EXPIRED_REFRESH_TOKEN || "7 days",
}) => {
    // Generate access token with public key
    const accessToken = await JWT.sign(payload, publicKey, {
        expiresIn: expiresInAccessToken,
    });

    // Generate refresh token with private key
    const refreshToken = await JWT.sign(payload, privateKey, {
        expiresIn: expiresInRefreshToken,
    });

    return { accessToken, refreshToken };
};

/**
 * Verifies a token using the provided secure key.
 *
 * @param {string} token - The token to be verified.
 * @param {string} secureKey - The secure key used to verify the token.
 * @return {Promise<object>} The decoded token if verification is successful.
 * @throws {AuthFailureError} If the token verification fails.
 */
const verifyToken = async (token, secureKey) => {
    try {
        const decode = await JWT.verify(token, secureKey);
        return decode;
    } catch (error) {
        throw new AuthFailureError(error.message);
    }
};

const checkOwn = async ({ userId, model, key, value }) => {
    const foundOwn = await model.findOne({
        user_id: userId,
        [key]: value,
    });

    if (!foundOwn) {
        throw new AuthFailureError("Bạn không có quyền truy cập!");
    }

    return foundOwn;
};

module.exports = { createTokenPair, verifyToken, checkOwn };
