"use strict";

const { NotfoundRequestError } = require("../core/error.response");
const { answerModel } = require("../models/answer.model");
const { questionModel } = require("../models/question.model");
const { questionTypeModel } = require("../models/questionType.model");
const _ = require("lodash");

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

    static async updateQuestion(
        questionId,
        { answers = [], part_id, question_explain = null, question_transcript = null }
    ) {
        const question = await questionModel.findById(questionId);

        if (!question) {
            throw new NotfoundRequestError(`Không tìm thấy câu hỏi!`);
        }

        const payload = {};

        if (question_explain) {
            payload["question_explain"] = question_explain;
        }

        if (question_transcript) {
            payload["question_transcript"] = question_transcript;
        }

        if (!_.isEmpty(payload)) {
            await questionModel.updateOne({ question_id: questionId }, payload);
        }

        await Promise.all(
            answers.map(async (answer) => {
                await answerModel.updateOne(
                    { answer_id: answer.answer_id },
                    {
                        answer_isCorrect: answer.answer_isCorrect,
                    }
                );

                return answer;
            })
        );

        return true;
    }

    static async find(filters) {
        const { results, pagination } = await questionModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }
}

module.exports = QuestionService;
