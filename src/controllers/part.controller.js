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
        const { partName, description = "", partNumber } = req.body;
        const part = await PartService.create({ partName, description, partNumber });

        return new Created({
            message: "Create part successfully",
            metadata: part,
        }).send(res);
    }

    async update(req, res) {
        const { partId } = req.params;
        const { partName, description = "", partNumber = -1 } = req.body;
        const part = await PartService.update(partId, { partName, partNumber, description });

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

    async delete(req, res) {
        const { partId } = req.params;
        const part = await PartService.delete(partId);

        return new OK({
            message: "Delete part successfully",
            metadata: part,
        }).send(res);
    }
}

module.exports = new PartController();
