"use strict";

const QueryHelper = require("../helpers/query.helper");
const {
    filterPropOutsideInstance,
    asyncPool,
    mapperUnSelect,
    parseValueToJson,
} = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");
const { questionModel } = require("./question.model");
const { answerModel } = require("./answer.model");
const { groupQuestionModel } = require("./groupQuestion.model");
const { partModel } = require("./part.model");

class ExamDetailsDao extends SoftDeleteModel {
    constructor({
        detail_id,
        exam_id,
        answer_id,
        question_id,
        created_at,
        updated_at,
        deleted_at,
    }) {
        super({ created_at, updated_at, deleted_at });

        this.detail_id = detail_id;
        this.exam_id = exam_id;
        this.answer_id = answer_id;
        this.question_id = question_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                detail_id: 1,
                exam_id: 1,
                answer_id: 1,
                question_id: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class ExamDetailsModel extends BaseModel {
    get tableName() {
        return "exam_details";
    }

    get idColumn() {
        return "detail_id";
    }

    async findById(detailsId) {
        const response = await super.findOne({ detail_id: detailsId });

        if (!response) return null;

        return new ExamDetailsDao(response);
    }

    async findByExamId(examId) {
        const response = await super.find({ exam_id: examId });

        if (!response.length) return { results: [], questionOrders: [] };

        let examDetails = response.map((row) => new ExamDetailsDao(row));

        const results = [];
        const questionOrders = [];
        const questionOrderWrong = [];
        const questionOrderSkip = [];
        const questionOrderCorrect = [];

        await asyncPool(1, examDetails, (t) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const answerDetail = mapperUnSelect(t, [
                        "created_at",
                        "updated_at",
                        "deleted_at",
                    ]);

                    const [question, answers] = await Promise.all([
                        questionModel.findById(t.question_id),
                        answerModel.findByQuestionId(t.question_id),
                    ]);

                    const answerCorrect = answers.find((a) => a.answer_isCorrect);

                    const newQuestion = {
                        ...question,
                        answer_id: t.answer_id,
                        answerCorrect,
                        question_audio: parseValueToJson({ value: question?.question_audio }),
                        question_image: parseValueToJson({ value: question?.question_image }),
                    };

                    if (!t.answer_id) {
                        questionOrderSkip.push(newQuestion.question_order);
                    } else {
                        const findAnswer = answers.find((a) => a.answer_id === t.answer_id);

                        if (findAnswer && findAnswer.answer_isCorrect) {
                            questionOrderCorrect.push(newQuestion.question_order);
                        } else {
                            questionOrderWrong.push(newQuestion.question_order);
                        }
                    }

                    const part = await partModel.findById(newQuestion.part_id);

                    const index = questionOrders.findIndex(
                        (t) => t?.part_number === part.part_number
                    );

                    if (index === -1) {
                        questionOrders.push({
                            orders: [newQuestion.question_order],
                            part_number: part.part_number,
                        });
                    } else {
                        questionOrders[index] = {
                            ...questionOrders[index],
                            orders: [...questionOrders[index].orders, newQuestion.question_order],
                        };
                    }

                    if (newQuestion && newQuestion.group_question_id) {
                        // get group newQuestion
                        const index = results.findIndex(
                            (r) => r?.group?.group_id === newQuestion.group_question_id
                        );

                        if (index !== -1) {
                            const record = {
                                ...results[index],
                                group_questions: [
                                    ...results[index].group_questions,
                                    {
                                        ...mapperUnSelect(newQuestion, [
                                            "created_at",
                                            "updated_at",
                                        ]),
                                        answers: answers.map((a) =>
                                            mapperUnSelect(a, ["created_at", "updated_at"])
                                        ),
                                    },
                                ],
                            };

                            results[index] = record;
                        } else {
                            // found group newQuestion
                            const group = await groupQuestionModel.findById(
                                newQuestion.group_question_id
                            );

                            if (!group) return resolve(true);

                            const groupParser = {
                                ...group,
                                group_audio: parseValueToJson({ value: group?.group_audio }),
                                group_image: parseValueToJson({ value: group?.group_image }),
                            };

                            results.push({
                                ...answerDetail,
                                group: mapperUnSelect(groupParser, ["created_at", "updated_at"]),
                                group_questions: [
                                    {
                                        ...mapperUnSelect(newQuestion, [
                                            "created_at",
                                            "updated_at",
                                        ]),
                                        answers: answers.map((a) =>
                                            mapperUnSelect(a, ["created_at", "updated_at"])
                                        ),
                                    },
                                ],
                            });
                        }

                        return resolve(true);
                    }

                    const row = {
                        ...answerDetail,

                        question: {
                            ...mapperUnSelect(newQuestion, [
                                "created_at",
                                "updated_at",
                                "deleted_at",
                            ]),
                            answers,
                        },
                    };

                    results.push(row);

                    return resolve(true);
                } catch (error) {
                    reject(error);
                }
            });
        });

        return {
            examDetails: results,
            questionOrders,
            questionOrderWrong,
            questionOrderSkip,
            questionOrderCorrect,
        };
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: ExamDetailsDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new ExamDetailsDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { ExamDetailsDao, examDetailsModel: new ExamDetailsModel() };
