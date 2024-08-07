"use strict";

const { OK } = require("../core/success.response");
const QuestionService = require("../services/question.service");

class QuestionController {
    async getByTestId(req, res) {
        const { testId } = req.params;

        const response = await QuestionService.getQuestionByTestId(testId);

        return new OK({
            message: "Get questions successfully",
            metadata: response.results,
            options: response.questionOrders,
        }).send(res);
    }

    async getByTestPartId(req, res) {
        const { testId, partId } = req.params;

        return new OK({
            message: "Get questions successfully",
            metadata: await QuestionService.getByTestPartId({ testId, partId }),
        }).send(res);
    }

    async getByTestQuestionTypeId(req, res) {
        const { testId, questionTypeId } = req.params;

        return new OK({
            message: "Get questions successfully",
            metadata: await QuestionService.getByTestQuestionId({ testId, questionTypeId }),
        }).send(res);
    }

    async updateQuestion(req, res) {
        const { questionId } = req.params;

        return new OK({
            message: "Update questions successfully",
            metadata: await QuestionService.updateQuestion(questionId, req.body),
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await QuestionService.find(req.query);

        return new OK({
            message: "Find questions successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new QuestionController();
