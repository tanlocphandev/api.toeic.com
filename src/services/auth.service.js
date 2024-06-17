"use strict";

const { USER_ROLES } = require("../constants");
const {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
} = require("../core/error.response");
const { userModel } = require("../models/user.model");
const { generateRandomString, mapperSelect, mapperUnSelect } = require("../utils");
const bcrypt = require("bcrypt");
const Crypto = require("../libs/crypto.lib");
const { createTokenPair } = require("../helpers/auth.helper");
const KeyTokenService = require("./keyToken.service");

class AuthService {
    /**
     * Registers a new user with the given full name, password, and email.
     *
     * @param {string} fullName - The user's full name.
     * @param {string} password - The user's password.
     * @param {string} email - The user's email.
     * @throws {ConflictRequestError} If a user with the given email already exists.
     * @return {Promise<number>} The ID of the newly registered user.
     */
    static async register({ fullName, password, email }) {
        const userInsert = {
            user_fullName: fullName,
            user_password: password,
            user_email: email,
        };

        // Find if user exists
        const [user, userAdminExist, salt] = await Promise.all([
            userModel.findByEmail(email),
            userModel.checkExistRoleAdmin(),
            bcrypt.genSalt(10),
        ]);

        if (user) {
            throw new ConflictRequestError("Email đã tồn tại!");
        }

        // Hash password
        userInsert["user_password"] = await bcrypt.hash(password, salt);
        userInsert["user_salt"] = salt;
        userInsert["user_role"] = userAdminExist ? USER_ROLES.USER : USER_ROLES.ADMIN;

        // Generate id
        userInsert["user_id_prefix"] = generateRandomString(16, true);

        // Insert user
        const result = await userModel.insert(userInsert);

        // Return id
        return result?.insertId;
    }

    /**
     * Authenticates a user by email and password. If the user exists and the password matches,
     * generates a public and private key pair, generates tokens using the public key, and saves
     * the private key in the database along with the tokens. Returns the user object with selected
     * fields and the tokens.
     *
     * @param {Object} options - The options object.
     * @param {string} options.email - The email of the user.
     * @param {string} options.password - The password of the user.
     * @throws {AuthFailureError} If the user does not exist or the password is incorrect.
     * @return {Promise<Object>} The user object with selected fields and the tokens.
     */
    static async login({ email, password }) {
        // Find if user exists
        const user = await userModel.findByEmail(email);

        if (!user) throw new AuthFailureError("Sai email hoặc mật khẩu");

        // Check password
        const match = await bcrypt.compare(password, user.user_password);
        if (!match) throw new AuthFailureError("Sai email hoặc mật không trùng khớp");

        // Generate public and private key
        const privateKey = Crypto.generateKey();
        const publicKey = Crypto.generateKey();

        // Generate tokens
        const tokens = await createTokenPair({
            payload: { userId: user.user_id, email },
            publicKey,
            privateKey,
        });

        await KeyTokenService.create({
            userId: user.user_id,
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken,
        });

        return {
            user: mapperSelect(user, ["user_id", "user_fullName", "user_role"]),
            tokens,
        };
    }

    /**
     * Refreshes the user's tokens and updates the key store.
     *
     * @param {Object} options - The options object.
     * @param {Object} options.user - The user object.
     * @param {string} options.user.email - The user's email.
     * @param {string} options.user.userId - The user's ID.
     * @param {Object} options.keyStore - The key store object.
     * @param {string} options.keyStore.refresh_token_used - The refresh token used.
     * @param {string} options.keyStore.key_id - The key ID.
     * @param {string} options.keyStore.private_key - The private key.
     * @param {string} options.keyStore.public_key - The public key.
     * @param {string} options.keyStore.refresh_token - The refresh token.
     * @param {string} options.refreshToken - The refresh token.
     * @return {Promise<Object>} The updated user and tokens.
     * @throws {AuthFailureError} If the refresh token is invalid or the user is not registered.
     */
    static async refresh({ user, keyStore, refreshToken }) {
        const { email, userId } = user;
        const { refresh_token_used, key_id, private_key, public_key, refresh_token } = keyStore;
        const refreshTokenUsed = JSON.parse(refresh_token_used) || [];

        // Check refreshToken used
        if (refreshTokenUsed.includes(refreshToken)) {
            // remove key store
            await KeyTokenService.removeById(key_id);
            throw new AuthFailureError("Some error, Please login again!");
        }

        // Check if refresh token invalid refresh token
        if (refresh_token !== refreshToken) {
            throw new AuthFailureError("Invalid refresh token!");
        }

        // Get user by email
        const foundUser = await userModel.findByEmail(email);
        if (!foundUser) {
            throw new AuthFailureError("User not register!");
        }

        // Push refreshToken used
        refreshTokenUsed.push(refreshToken);

        // Create new tokens
        const tokens = await createTokenPair({
            payload: { userId, email },
            publicKey: public_key,
            privateKey: private_key,
        });

        // Update key store
        const updateKeyStore = {
            refresh_token_used: JSON.stringify(refreshTokenUsed),
            refresh_token: tokens.refreshToken,
        };

        await KeyTokenService.updateById(key_id, updateKeyStore);

        return {
            user: { email, userId },
            tokens,
        };
    }

    static async getMe(userId) {
        const user = await userModel.findById(userId);
        return mapperUnSelect(user, ["user_password", "user_salt", "user_verify"]);
    }

    static async logout(keyStore) {
        await KeyTokenService.removeById(keyStore.key_id);

        return true;
    }
}

module.exports = AuthService;
