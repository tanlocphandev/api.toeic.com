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
        const response = await RbacService.getListRole(req.query);

        new OK({
            message: "Get list role successfully",
            metadata: response,
        }).send(res);
    }

    async createGrant(req, res) {
        const response = await RbacService.createGrant(req.body);

        new Created({
            message: "Create grant successfully",
            metadata: response,
        }).send(res);
    }

    async updateGrant(req, res) {
        const response = await RbacService.updateGrant(req.params.grantId, req.body);

        new OK({
            message: "Update grant successfully",
            metadata: response,
        }).send(res);
    }

    async createGrantMultiple(req, res) {
        const response = await RbacService.createGrantMultiple(req.body);

        new Created({
            message: "Create grants successfully",
            metadata: response,
        }).send(res);
    }

    async getListGrant(req, res) {
        const response = await RbacService.getAllGrants();

        new OK({
            message: "Get list grant successfully",
            metadata: response,
        }).send(res);
    }

    async addGrantToRole(req, res) {
        const response = await RbacService.addGrantToRole(req.body);

        new Created({
            message: "Add grant successfully",
            metadata: response,
        }).send(res);
    }

    async removeGrantToRole(req, res) {
        const response = await RbacService.removeGrantToRole(req.body);

        new OK({
            message: "Remove grant successfully",
            metadata: response,
        }).send(res);
    }
}

module.exports = new RbacController();
