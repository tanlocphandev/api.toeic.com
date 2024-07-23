"use strict";

const { questionModel } = require("../models/question.model");
const { questionTypeModel } = require("../models/questionType.model");

class QuestionService {
    static async getQuestionByTestId(testId) {
        const response = await questionModel.findByTestId(testId);
        return response;
    }

    static async getByTestPartId({ testId, partId }) {
        const response = await questionModel.findByTestPartId({ testId, partId });
        return response;
    }

    static async getByTestQuestionId({ testId, questionTypeId }) {
        const questionType = await questionTypeModel.findById(questionTypeId);

        const response = await questionModel.findTest({
            conditions: {
                test_id: testId,
                question_type_id: questionTypeId,
            },
            testId,
            partId: questionType.part_id,
        });

        return response;
    }
}

module.exports = QuestionService;
