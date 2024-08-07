"use strict";

const { OK, Created } = require("../core/success.response");
const QuestionTypeService = require("../services/questionType.service");

class QuestionTypeController {
    async createMultipleWithUploadFile(req, res) {
        const { types = [] } = req.body;
        const createdTypes = await QuestionTypeService.createMultipleWithUploadFile(types);
        return new Created({
            message: "Create question type successfully",
            metadata: createdTypes,
        }).send(res);
    }

    async create(req, res) {
        const { typeName, partId, description = "", thumb = null } = req.body;
        const type = await QuestionTypeService.create({ typeName, partId, description, thumb });

        return new Created({
            message: "Create question type successfully",
            metadata: type,
        }).send(res);
    }

    async update(req, res) {
        const { typeId } = req.params;
        const { typeName, description = "", thumb = null } = req.body;
        const type = await QuestionTypeService.update(typeId, {
            typeName,
            description,
            thumb,
        });

        return new OK({
            message: "Update question type successfully",
            metadata: type,
        }).send(res);
    }

    async findById(req, res) {
        const { typeId } = req.params;
        const type = await QuestionTypeService.findById(typeId);

        return new OK({
            message: "Find question type successfully",
            metadata: type,
        }).send(res);
    }

    async findBySlug(req, res) {
        const { slug } = req.params;
        const type = await QuestionTypeService.findBySlug(slug);

        return new OK({
            message: "Find question type successfully",
            metadata: type,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await QuestionTypeService.find(req.query);

        return new OK({
            message: "Find question type successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }

    async deleteById(req, res) {
        const { typeId } = req.params;
        await QuestionTypeService.delete(typeId);

        return new OK({
            message: "Delete question type successfully",
        }).send(res);
    }
}

module.exports = new QuestionTypeController();
