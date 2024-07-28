"use strict";

const { OK, Created } = require("../core/success.response");
const DocumentService = require("../services/document.service");

class DocumentController {
    async create(req, res) {
        const document = await DocumentService.create(req.body);

        return new Created({
            message: "Create document successfully",
            metadata: document,
        }).send(res);
    }

    async update(req, res) {
        const { docId } = req.params;

        const doc = await DocumentService.update(docId, req.body);

        return new OK({
            message: "Update doc successfully",
            metadata: doc,
        }).send(res);
    }

    async findById(req, res) {
        const { docId } = req.params;
        const document = await DocumentService.findById(docId);

        return new OK({
            message: "Find document successfully",
            metadata: document,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await DocumentService.find(req.query);

        return new OK({
            message: "Find document successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }

    async delete(req, res) {
        const { docId } = req.params;
        const document = await DocumentService.delete(docId);

        return new OK({
            message: "Delete document successfully",
            metadata: document,
        }).send(res);
    }
}

module.exports = new DocumentController();
