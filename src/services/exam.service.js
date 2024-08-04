"use strict";

const { examModel } = require("../models/exam.model");
const { examDetailsModel } = require("../models/examDetails.model");
const { answerModel } = require("../models/answer.model");
const { testModel } = require("../models/test.model");
const { questionTypeModel } = require("../models/questionType.model");
const Transaction = require("../db/transaction.db");
const { mapValue, mapperUnSelect } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const { scoreModel } = require("../models/score.model");
const MysqlHelper = require("../helpers/mysql.helper");
const { EXAM_TYPES } = require("../constants");

class ExamService {
    static async create({ answers = {}, testId, userId, questionTypeId = null, timer, examType }) {
        const connection = await Transaction.startTransaction();

        try {
            // foundScore
            const foundScore = await Transaction.findOne({
                tableName: scoreModel.tableName,
                conditions: {
                    score_status: "active",
                },
                connection,
            });

            // prepare data insert exam
            const payload = {
                exam_total_question: 0,
                exam_count_question_correct: 0,
                exam_count_question_wrong: 0,
                exam_count_question_skip: 0,
                exam_count_reading_correct: 0,
                exam_count_listening_correct: 0,
                exam_type: examType,
                exam_used_timer: timer,
                score_id: foundScore?.score_id || null,
                user_id: userId,
                test_id: testId,
                question_type_id: mapValue({ rawValue: questionTypeId }),
            };

            await Transaction.update({
                tableName: testModel.tableName,
                data: {
                    test_user_count: MysqlHelper.inc("test_user_count", 1),
                },
                conditions: {
                    test_id: testId,
                },
                connection,
            });

            const answerToArray = Object.entries(answers).map(([questionId, answerId]) => ({
                questionId,
                answerId,
            }));

            // check if all question is null then throw error
            if (answerToArray.every(({ answerId }) => !answerId)) {
                throw new BadRequestError("Vui lòng chọn đáp án ít nhất 1 câu hỏi!");
            }

            // handle calculate total answer
            await Promise.all(
                answerToArray.map(async ({ answerId }, index) => {
                    if (!answerId) {
                        payload.exam_count_question_skip += 1;
                        return true;
                    }

                    const foundAnswerCorrect = await Transaction.findOne({
                        tableName: answerModel.tableName,
                        conditions: { answer_id: answerId },
                        connection,
                    });

                    if (foundAnswerCorrect?.answer_isCorrect) {
                        payload.exam_count_question_correct += 1;

                        if (index <= 99) {
                            payload.exam_count_listening_correct += 1;
                        } else {
                            payload.exam_count_reading_correct += 1;
                        }
                    } else {
                        payload.exam_count_question_wrong += 1;
                    }

                    return true;
                })
            );

            payload.exam_total_question =
                payload.exam_count_question_correct +
                payload.exam_count_question_wrong +
                payload.exam_count_question_skip;

            // create new exam
            const newExam = await Transaction.insert({
                data: payload,
                tableName: examModel.tableName,
                connection,
            });

            // create new exam details
            await Transaction.insertBulk({
                data: answerToArray.map(({ questionId, answerId }) =>
                    Object.values({
                        exam_id: newExam.insertId,
                        question_id: questionId,
                        answer_id: mapValue({ rawValue: answerId }),
                    })
                ),
                tableName: examDetailsModel.tableName,
                fields: ["exam_id", "question_id", "answer_id"],
                connection,
            });

            await Transaction.commit(connection);

            return newExam.insertId;
        } catch (error) {
            console.log(`Error in create new exam:::`, error);
            await Transaction.rollback(connection);
            throw error;
        } finally {
            await Transaction.release(connection);
        }
    }

    static async getById(examId) {
        const [exam, examDetails] = await Promise.all([
            examModel.findById(examId),
            examDetailsModel.findByExamId(examId),
        ]);

        if (!exam) return null;

        const [questionType, test] = await Promise.all([
            questionTypeModel.findById(exam.question_type_id),
            testModel.findById(exam.test_id),
        ]);

        return {
            ...mapperUnSelect(exam, ["created_at", "updated_at", "deleted_at"]),
            ...examDetails,
            test,
            questionType,
        };
    }

    static async find(filters) {
        const { results, pagination } = await examModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }

    static async countExamFullTest(userId) {
        const result = await examModel.count({
            user_id: userId,
            exam_type: EXAM_TYPES.FULL_TEST,
        });

        return result;
    }

    static async sumTotalTimeExam(userId) {
        const result = await examModel.sum(
            {
                user_id: userId,
                exam_type: EXAM_TYPES.FULL_TEST,
            },
            "exam_used_timer"
        );

        return result;
    }

    static async getMaxQuestionCorrectByUserId(userId) {
        return await examModel.getMaxQuestionCorrectByUserId(userId);
    }
}

module.exports = ExamService;
