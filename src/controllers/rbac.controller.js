"use strict";

const { OK, Created } = require("../core/success.response");
const RbacService = require("../services/rbac.service");

class RbacController {
    async creteResource(req, res) {
        const response = await RbacService.createResource(req.body);

        new Created({
            message: "Create resource successfully",
            metadata: response,
        }).send(res);
    }

    async getAllResource(req, res) {
        const response = await RbacService.getAllResources();

        new OK({
            message: "Get all resource successfully",
            metadata: response,
        }).send(res);
    }

    async creteRole(req, res) {
        const response = await RbacService.createRole(req.body);

        new Created({
            message: "Create role successfully",
            metadata: response,
        }).send(res);
    }

    async getListRole(req, res) {
        const response = await RbacService.getListRole();

        new OK({
            message: "Get list role successfully",
            metadata: response,
        }).send(res);
    }
}

module.exports = new RbacController();
