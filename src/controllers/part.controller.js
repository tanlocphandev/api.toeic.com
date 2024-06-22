"use strict";

const { OK, Created } = require("../core/success.response");
const PartService = require("../services/part.service");

class PartController {
    async createMultipleWithUploadFile(req, res) {
        const { parts = [] } = req.body;
        const createdParts = await PartService.createMultipleWithUploadFile(parts);
        return new Created({
            message: "Create parts successfully",
            metadata: createdParts,
        }).send(res);
    }

    async create(req, res) {
        const { partName } = req.body;
        const part = await PartService.create({ partName });

        return new Created({
            message: "Create part successfully",
            metadata: part,
        }).send(res);
    }

    async update(req, res) {
        const { partId } = req.params;
        const { partName } = req.body;
        const part = await PartService.update(partId, { partName });

        return new OK({
            message: "Update part successfully",
            metadata: part,
        }).send(res);
    }

    async findById(req, res) {
        const { partId } = req.params;
        const part = await PartService.findById(partId);

        return new OK({
            message: "Find part successfully",
            metadata: part,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await PartService.find(req.query);

        return new OK({
            message: "Find part successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new PartController();
