"use strict";

const UserModel = require("../models/user.model");

class AuthService {
    static async register({ fullName, password, email }) {
        const userModel = new UserModel({
            user_name: fullName,
            user_password: password,
            user_email: email,
        });

        return await userModel.create();
    }
}

module.exports = AuthService;
