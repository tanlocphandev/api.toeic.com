"use strict";

const { OK } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
    async find(req, res) {
        return new OK({
            message: "Find user successfully",
            metadata: await UserService.find(),
        }).send(res);
    }
}

module.exports = new UserController();
