"use strict";

const { OK } = require("../core/success.response");
const TestPartService = require("../services/testPart.service");

class TestPartController {
    async getByPartId(req, res) {
        const { partId } = req.params;
        const result = await TestPartService.getByPartId(partId);
        return new OK({ message: "Get test part successfully", metadata: result }).send(res);
    }

    async getById(req, res) {
        const { partId, testId } = req.params;
        const result = await TestPartService.getById(partId, testId);
        return new OK({ message: "Get test part successfully", metadata: result }).send(res);
    }
}

module.exports = new TestPartController();
