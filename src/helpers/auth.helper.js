"use strict";

const JWT = require("jsonwebtoken");

/**
 * Creates a token pair consisting of an access token and a refresh token.
 *
 * @param {Object} payload - The payload to be included in the tokens.
 * @param {string} publicKey - The public key used to sign the access token.
 * @param {string} privateKey - The private key used to sign the refresh token.
 * @return {Promise<{ accessToken: string; refreshToken: string }>} An object containing the access token and the refresh token.
 */
const createTokenPair = async (payload, publicKey, privateKey) => {
    // Generate access token with public key
    const accessToken = await JWT.sign(payload, publicKey, {
        expiresIn: "2 days",
    });

    // Generate refresh token with private key
    const refreshToken = await JWT.sign(payload, privateKey, {
        expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
};

module.exports = { createTokenPair };
