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

    async addTeacher(req, res) {
        return new OK({
            message: "Add teacher successfully",
            metadata: await UserService.addTeacher(req.body),
        }).send(res);
    }

    async updateProfile(req, res) {
        const { userId } = req.user;

        return new OK({
            message: "Update profile successfully",
            metadata: await UserService.updateProfile(userId, req.body),
        }).send(res);
    }
}

module.exports = new UserController();
