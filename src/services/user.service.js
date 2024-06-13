"use strict";

const { userModel } = require("../models/user.model");
const { mapperUnSelect } = require("../utils");

class UserService {
    static async find() {
        const response = await userModel.find();

        if (!response.length) return [];

        return response.map((row) =>
            mapperUnSelect(row, ["user_password", "user_salt", "user_verify"])
        );
    }
}

module.exports = UserService;
