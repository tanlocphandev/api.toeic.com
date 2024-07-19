"use strict";

const { questionModel } = require("../models/question.model");

class QuestionService {
    static async getQuestionByTestId(testId) {
        const response = await questionModel.findByTestId(testId);
        return response;
    }
}

module.exports = QuestionService;
