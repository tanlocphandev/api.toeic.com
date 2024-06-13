"use strict";

const { USER_ROLES } = require("../constants");
const {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
} = require("../core/error.response");
const { userModel } = require("../models/user.model");
const { generateRandomString, mapperSelect } = require("../utils");
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
        const tokens = await createTokenPair(
            { userId: user.user_id, email },
            publicKey,
            privateKey
        );

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
}

module.exports = AuthService;
