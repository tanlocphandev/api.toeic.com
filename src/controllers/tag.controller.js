"use strict";

const { OK, Created } = require("../core/success.response");
const TagService = require("../services/tag.service");

class TagController {
    async createMultipleWithUploadFile(req, res) {
        const { tags = [] } = req.body;
        const createdTags = await TagService.createMultipleWithUploadFile(tags);
        return new Created({
            message: "Create tags successfully",
            metadata: createdTags,
        }).send(res);
    }

    async create(req, res) {
        const { tagName } = req.body;
        const tag = await TagService.create({ tagName });

        return new Created({
            message: "Create tag successfully",
            metadata: tag,
        }).send(res);
    }

    async update(req, res) {
        const { tagId } = req.params;
        const { tagName } = req.body;
        const tag = await TagService.update(tagId, { tagName });

        return new OK({
            message: "Update tag successfully",
            metadata: tag,
        }).send(res);
    }

    async findById(req, res) {
        const { tagId } = req.params;
        const tag = await TagService.findById(tagId);

        return new OK({
            message: "Find tag successfully",
            metadata: tag,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await TagService.find(req.query);

        return new OK({
            message: "Find tag successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }

    async deleteById(req, res) {
        const { tagId } = req.params;
        const tag = await TagService.deleteById(tagId);

        return new OK({
            message: "Delete tag successfully",
            metadata: tag,
        }).send(res);
    }
}

module.exports = new TagController();
