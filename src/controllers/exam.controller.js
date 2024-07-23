"use strict";

const { OK, Created } = require("../core/success.response");
const ExamService = require("../services/exam.service");

class ExamController {
    async create(req, res) {
        const exam = await ExamService.create(req.body);
        return new Created({ message: "Create exam successfully", metadata: exam }).send(res);
    }

    async getById(req, res) {
        const { examId } = req.params;
        const exam = await ExamService.getById(examId);
        return new OK({ message: "Get exam successfully", metadata: exam }).send(res);
    }
}

module.exports = new ExamController();
