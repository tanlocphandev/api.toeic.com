"use strict";

const { userModel } = require("../models/user.model");

class UserService {
    static async find() {
        return await userModel.find();
    }
}

module.exports = UserService;
