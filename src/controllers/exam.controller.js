"use strict";

const { USER_ROLES } = require("../constants");
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

    async countExamFullTest(req, res) {
        const { userId } = req.user;
        const resultCount = await ExamService.countExamFullTest(userId);
        return new OK({
            message: "Get count exam full test successfully",
            metadata: resultCount,
        }).send(res);
    }

    async sumTotalTimeExam(req, res) {
        const { userId } = req.user;
        const resultSum = await ExamService.sumTotalTimeExam(userId);
        return new OK({
            message: "Get sum exam full test successfully",
            metadata: resultSum,
        }).send(res);
    }

    async getMaxQuestionCorrectByUserId(req, res) {
        const { userId } = req.user;
        const resultSum = await ExamService.getMaxQuestionCorrectByUserId(userId);
        return new OK({
            message: "Get max question correct by user successfully",
            metadata: resultSum,
        }).send(res);
    }

    async find(req, res) {
        const user = req.user;

        const query =
            user.role === USER_ROLES.ADMIN
                ? req.query
                : {
                      ...req.query,
                      query: req.query
                          ? `${req.query};user_id:${user.userId}`
                          : `user_id:${user.userId}`,
                  };

        const { results, pagination } = await ExamService.find(query);

        return new OK({
            message: "Find exam successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new ExamController();
