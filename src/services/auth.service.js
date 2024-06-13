"use strict";

const { USER_ROLES } = require("../constants");
const { ConflictRequestError } = require("../core/error.response");
const { userModel } = require("../models/user.model");
const { generateRandomString } = require("../utils");
const bcrypt = require("bcrypt");

class AuthService {
    /**
     * Registers a new user with the given full name, password, and email.
     *
     * @param {Object} user - An object containing the user's full name, password, and email.
     * @param {string} user.fullName - The user's full name.
     * @param {string} user.password - The user's password.
     * @param {string} user.email - The user's email.
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
        return result[0].insertId;
    }
}

module.exports = AuthService;
