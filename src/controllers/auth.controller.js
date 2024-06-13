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
}

module.exports = new AuthController();
