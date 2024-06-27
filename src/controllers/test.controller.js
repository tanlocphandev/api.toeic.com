"use strict";

const { OK, Created } = require("../core/success.response");
const TesService = require("../services/test.service");

class TestController {
    async createMultipleWithUploadFile(req, res) {
        const { tests = [] } = req.body;
        const createdTests = await TesService.createMultipleWithUploadFile(tests);
        return new Created({
            message: "Create tests successfully",
            metadata: createdTests,
        }).send(res);
    }

    async create(req, res) {
        const test = await TesService.create(req.body);

        return new Created({
            message: "Create test successfully",
            metadata: test,
        }).send(res);
    }

    async update(req, res) {
        const { testId } = req.params;
        const test = await TesService.update(testId, req.body);

        return new OK({
            message: "Update test successfully",
            metadata: test,
        }).send(res);
    }

    async findById(req, res) {
        const { testId } = req.params;
        const test = await TesService.findById(testId);

        return new OK({
            message: "Find test successfully",
            metadata: test,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await TesService.find(req.query);

        return new OK({
            message: "Find test successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new TestController();
