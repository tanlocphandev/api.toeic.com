"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");
const { questionTypeModel } = require("./questionType.model");
const { testModel } = require("./test.model");
const { scoreModel } = require("./score.model");
const { scoreDetailsModel } = require("./scoreDetail.model");
const MysqlHelper = require("../helpers/mysql.helper");
const { EXAM_TYPES } = require("../constants");

class ExamDao extends SoftDeleteModel {
    constructor({
        exam_id,
        exam_total_question,
        exam_count_question_correct,
        exam_count_reading_correct,
        exam_count_listening_correct,
        exam_count_question_wrong,
        exam_count_question_skip,
        exam_type,
        exam_used_timer,
        exam_target,
        score_id,
        user_id,
        test_id,
        question_type_id,
        created_at,
        updated_at,
        deleted_at,
    }) {
        super({ created_at, updated_at, deleted_at });

        this.exam_id = exam_id;
        this.exam_total_question = exam_total_question;
        this.exam_count_question_correct = exam_count_question_correct;
        this.exam_count_reading_correct = exam_count_reading_correct;
        this.exam_count_listening_correct = exam_count_listening_correct;
        this.exam_count_question_wrong = exam_count_question_wrong;
        this.exam_count_question_skip = exam_count_question_skip;
        this.exam_type = exam_type;
        this.exam_target = exam_target;
        this.exam_used_timer = exam_used_timer;
        this.score_id = score_id;
        this.user_id = user_id;
        this.test_id = test_id;
        this.question_type_id = question_type_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                exam_id: 1,
                exam_total_question: 1,
                exam_count_question_correct: 1,
                exam_count_reading_correct: 1,
                exam_count_listening_correct: 1,
                exam_count_question_wrong: 1,
                exam_count_question_skip: 1,
                exam_type: 1,
                exam_target: 1,
                exam_used_timer: 1,
                score_id: 1,
                user_id: 1,
                test_id: 1,
                question_type_id: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class ExamModel extends BaseModel {
    get tableName() {
        return "exams";
    }

    get idColumn() {
        return "exam_id";
    }

    _calculateTotalScore(score) {
        const { reading, listening } = score;
        return reading.reading_score + listening.listening_score;
    }

    async getMaxQuestionCorrectByUserId(userId) {
        let result = await super.callProcedure({
            procedureName: "prod_get_max_question_correct_by_userId",
            params: [userId],
        });

        if (!result?.length) return [];

        result = await Promise.all(
            result.map(async (row) => {
                let resultScore = null;

                if (row.score_id) {
                    const [foundScoreReading, foundScoreListening] = await Promise.all([
                        scoreDetailsModel.findOne({
                            score_id: row.score_id,
                            number_correct_answer: row.exam_count_reading_correct,
                        }),
                        scoreDetailsModel.findOne({
                            score_id: row.score_id,
                            number_correct_answer: row.exam_count_listening_correct,
                        }),
                    ]);

                    if (foundScoreReading && foundScoreListening) {
                        resultScore = {
                            reading: foundScoreReading,
                            listening: foundScoreListening,
                        };

                        const totalScore = this._calculateTotalScore(resultScore);

                        resultScore = { ...resultScore, totalScore };
                    }
                }

                return { ...row, score: resultScore };
            })
        );

        // console.log("====================================");
        // console.log(`getMaxQuestionCorrectByUserId::`, result);
        // console.log("====================================");

        return result;
    }

    async findById(examId) {
        const response = await super.findOne({ exam_id: examId });

        if (!response) return null;

        let resultScore = null;

        if (response.score_id) {
            const [foundScoreReading, foundScoreListening] = await Promise.all([
                scoreDetailsModel.findOne({
                    score_id: response.score_id,
                    number_correct_answer: response.exam_count_reading_correct,
                }),
                scoreDetailsModel.findOne({
                    score_id: response.score_id,
                    number_correct_answer: response.exam_count_listening_correct,
                }),
            ]);

            if (foundScoreReading && foundScoreListening) {
                resultScore = {
                    reading: foundScoreReading,
                    listening: foundScoreListening,
                };

                const totalScore = this._calculateTotalScore(resultScore);

                resultScore = { ...resultScore, totalScore };
            }
        }

        const result = new ExamDao(response);

        return { ...result, score: resultScore };
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: ExamDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new ExamDao(row));

            results = await Promise.all(
                results.map(async (row) => {
                    const test = await testModel.findById(row.test_id);
                    const questionType = await questionTypeModel.findById(row.question_type_id);

                    let resultScore = null;

                    if (row.score_id) {
                        const [foundScoreReading, foundScoreListening] = await Promise.all([
                            scoreDetailsModel.findOne({
                                score_id: row.score_id,
                                number_correct_answer: row.exam_count_reading_correct,
                            }),
                            scoreDetailsModel.findOne({
                                score_id: row.score_id,
                                number_correct_answer: row.exam_count_listening_correct,
                            }),
                        ]);

                        if (foundScoreReading && foundScoreListening) {
                            resultScore = {
                                reading: foundScoreReading,
                                listening: foundScoreListening,
                            };

                            const totalScore = this._calculateTotalScore(resultScore);

                            resultScore = { ...resultScore, totalScore };
                        }
                    }

                    return { ...row, test, questionType, score: resultScore };
                })
            );

            return { results, pagination: null };
        }

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new ExamDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }

    async statisticByDate(userId) {
        const response = await super.find({
            user_id: userId,
            score_id: MysqlHelper.isNotNull(),
            exam_type: EXAM_TYPES.FULL_TEST,
        });

        let results = response.map((row) => new ExamDao(row));

        results = await Promise.all(
            results.map(async (row) => {
                let resultScore = null;

                if (row.score_id) {
                    const [foundScoreReading, foundScoreListening] = await Promise.all([
                        scoreDetailsModel.findOne({
                            score_id: row.score_id,
                            number_correct_answer: row.exam_count_reading_correct,
                        }),
                        scoreDetailsModel.findOne({
                            score_id: row.score_id,
                            number_correct_answer: row.exam_count_listening_correct,
                        }),
                    ]);

                    if (foundScoreReading && foundScoreListening) {
                        resultScore = {
                            reading: foundScoreReading,
                            listening: foundScoreListening,
                        };

                        const totalScore = this._calculateTotalScore(resultScore);

                        resultScore = { ...resultScore, totalScore };
                    }
                }

                return { ...row, score: resultScore };
            })
        );

        return results;
    }
}

module.exports = { ExamDao, examModel: new ExamModel() };
