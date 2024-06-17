"use strict";

const { Created, OK } = require("../core/success.response");
const AuthService = require("../services/auth.service");

class AuthController {
    async register(req, res) {
        const { fullName, password, email } = req.body;

        return new Created({
            message: "Register successfully",
            metadata: await AuthService.register({ fullName, password, email }),
        }).send(res);
    }

    async login(req, res) {
        const { password, email } = req.body;

        return new OK({
            message: "Login successfully",
            metadata: await AuthService.login({ password, email }),
        }).send(res);
    }

    async getMe(req, res) {
        return new OK({
            message: "Get me successfully",
            metadata: await AuthService.getMe(req.user.userId),
        }).send(res);
    }

    async refresh(req, res) {
        const { user, keyStore, refreshToken } = req;

        return new OK({
            message: "Refresh successfully",
            metadata: await AuthService.refresh({ user, keyStore, refreshToken }),
        }).send(res);
    }

    async logout(req, res) {
        const { keyStore } = req;

        return new OK({
            message: "Logout successfully",
            metadata: await AuthService.logout(keyStore),
        }).send(res);
    }
}

module.exports = new AuthController();
