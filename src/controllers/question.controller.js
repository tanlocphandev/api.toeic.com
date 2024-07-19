"use strict";

const { OK } = require("../core/success.response");
const QuestionService = require("../services/question.service");

class QuestionController {
    async getByTestId(req, res) {
        const { testId } = req.params;

        return new OK({
            message: "Get questions successfully",
            metadata: await QuestionService.getQuestionByTestId(testId),
        }).send(res);
    }
}

module.exports = new QuestionController();
