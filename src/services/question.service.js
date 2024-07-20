"use strict";

const { questionModel } = require("../models/question.model");

class QuestionService {
    static async getQuestionByTestId(testId) {
        const response = await questionModel.findByTestId(testId);
        return response;
    }

    static async getByTestPartId({ testId, partId }) {
        const response = await questionModel.findByTestPartId({ testId, partId });
        return response;
    }
}

module.exports = QuestionService;
