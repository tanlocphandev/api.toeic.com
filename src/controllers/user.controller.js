"use strict";

const { OK } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
    async find(req, res) {
        const { results, pagination } = await UserService.find(req.query);

        return new OK({
            message: "Find user successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new UserController();
