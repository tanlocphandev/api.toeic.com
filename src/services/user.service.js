"use strict";

const { userModel } = require("../models/user.model");
const { mapperUnSelect } = require("../utils");

class UserService {
    static async find(query) {
        const { results, pagination } = await userModel.find(query);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results.map((row) =>
                mapperUnSelect(row, ["user_password", "user_salt", "user_verify"])
            ),
            pagination: pagination,
        };
    }
}

module.exports = UserService;
