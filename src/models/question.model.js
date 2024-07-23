"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { parseValueToJson, filterPropOutsideInstance, mapperUnSelect } = require("../utils");
const { partModel } = require("./part.model");
const { questionTypeModel } = require("./questionType.model");
const { questionTagModel } = require("./questionTag.model");
const { answerModel } = require("./answer.model");
const { groupQuestionModel } = require("./groupQuestion.model");

class QuestionDao extends TimestampModel {
    constructor({
        question_id,
        question_order,
        question_audio,
        question_image,
        question_text,
        question_transcript,
        question_explain,
        question_type_id,
        part_id,
        test_id,
        group_question_id,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.question_id = question_id;
        this.question_order = question_order;
        this.question_audio = question_audio;
        this.question_image = question_image;
        this.question_text = question_text;
        this.question_transcript = question_transcript;
        this.question_explain = question_explain;

        this.question_type_id = question_type_id;
        this.test_id = test_id;
        this.part_id = part_id;
        this.group_question_id = group_question_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                question_id: 1,
                question_order: 1,
                question_audio: 1,
                question_image: 1,
                question_text: 1,
                question_transcript: 1,
                question_explain: 1,
                question_type_id: 1,
                test_id: 1,
                part_id: 1,
                group_question_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class QuestionModel extends BaseModel {
    get tableName() {
        return "questions";
    }

    get idColumn() {
        return "question_id";
    }

    async findById(questionId) {
        const response = await super.findOne({ question_id: questionId });

        if (!response) return null;

        return new QuestionDao(response);
    }

    async findByQuestionOrder(questionOrder) {
        const response = await super.findOne({ question_order: questionOrder });

        if (!response) return null;

        return new QuestionDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: QuestionDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new QuestionDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }

    async findByTestId(testId) {
        const [questions, groupQuestions] = await Promise.all([
            super.find({ test_id: testId }, { key: "question_order", value: "asc" }),
            groupQuestionModel.findByTestId(testId),
        ]);

        if (!questions.length) return [];

        let result = questions.map((row) => new QuestionDao(row));

        result = result.map((t) => mapperUnSelect(t, ["created_at", "updated_at"]));

        result = await Promise.all(
            result.map(async (question) => {
                const [part, questionType, tags, answers] = await Promise.all([
                    partModel.findById(question.part_id),
                    questionTypeModel.findById(question.question_type_id),
                    questionTagModel.findByQuestionId(question.question_id, true),
                    answerModel.findByQuestionId(question.question_id, true),
                ]);

                return {
                    ...question,
                    question_audio: parseValueToJson({ value: question.question_audio }),
                    question_image: parseValueToJson({ value: question.question_image }),
                    part: mapperUnSelect(part, ["created_at", "updated_at"]),
                    questionType: mapperUnSelect(questionType, ["created_at", "updated_at"]),
                    tags,
                    answers,
                };
            })
        );

        const resultLength = result.length;
        const newResults = [];
        let groupQuestionIdFlat = -1;

        for (let index = 0; index < resultLength; index++) {
            const question = result[index];

            if (!question.group_question_id) {
                newResults.push(question);
            } else if (groupQuestionIdFlat !== question.group_question_id) {
                groupQuestionIdFlat = question.group_question_id;

                const groupQuestion = groupQuestions.find(
                    (item) => item.group_id === question.group_question_id
                );

                if (groupQuestion) {
                    newResults.push({
                        ...groupQuestion,
                        group_questions: [question],
                    });
                }
            } else {
                const index = newResults.findIndex(
                    (item) => item?.group_id === question.group_question_id
                );

                if (index === -1) continue;

                newResults[index] = {
                    ...newResults[index],
                    group_questions: [...newResults[index].group_questions, question],
                };
            }
        }

        return newResults;
    }

    async findByTestPartId({ testId, partId }) {
        const [questions, groupQuestions] = await Promise.all([
            super.find(
                { test_id: testId, part_id: partId },
                { key: "question_order", value: "asc" }
            ),
            groupQuestionModel.findByTestPartId({ testId, partId }),
        ]);

        if (!questions.length) return [];

        let result = questions.map((row) => new QuestionDao(row));

        result = result.map((t) => mapperUnSelect(t, ["created_at", "updated_at"]));

        result = await Promise.all(
            result.map(async (question) => {
                const [part, questionType, tags, answers] = await Promise.all([
                    partModel.findById(question.part_id),
                    questionTypeModel.findById(question.question_type_id),
                    questionTagModel.findByQuestionId(question.question_id, true),
                    answerModel.findByQuestionId(question.question_id, true),
                ]);

                return {
                    ...question,
                    question_audio: parseValueToJson({ value: question.question_audio }),
                    question_image: parseValueToJson({ value: question.question_image }),
                    part: mapperUnSelect(part, ["created_at", "updated_at"]),
                    questionType: mapperUnSelect(questionType, ["created_at", "updated_at"]),
                    tags,
                    answers,
                };
            })
        );

        const resultLength = result.length;
        const newResults = [];
        let questionOrders = [];
        let groupQuestionIdFlat = -1;

        for (let index = 0; index < resultLength; index++) {
            const question = result[index];

            // Get question order
            const indexQuestionOrder = questionOrders.findIndex(
                (item) => item.part_number === question.part.part_number
            );

            if (indexQuestionOrder === -1) {
                questionOrders.push({
                    part_number: question.part.part_number,
                    orders: [question.question_order],
                });
            } else {
                questionOrders[indexQuestionOrder] = {
                    ...questionOrders[indexQuestionOrder],
                    orders: [...questionOrders[indexQuestionOrder].orders, question.question_order],
                };
            }

            if (!question.group_question_id) {
                newResults.push(question);
            } else if (groupQuestionIdFlat !== question.group_question_id) {
                groupQuestionIdFlat = question.group_question_id;

                const groupQuestion = groupQuestions.find(
                    (item) => item.group_id === question.group_question_id
                );

                if (groupQuestion) {
                    newResults.push({
                        ...groupQuestion,
                        group_questions: [question],
                    });
                }
            } else {
                const index = newResults.findIndex(
                    (item) => item?.group_id === question.group_question_id
                );

                if (index === -1) continue;

                newResults[index] = {
                    ...newResults[index],
                    group_questions: [...newResults[index].group_questions, question],
                };
            }
        }

        return { questions: newResults, questionOrders };
    }

    async findTest({ conditions, testId, partId }) {
        const [questions, groupQuestions] = await Promise.all([
            super.find(conditions, { key: "question_order", value: "asc" }),
            groupQuestionModel.findByTestPartId({ testId, partId }),
        ]);

        if (!questions.length) return [];

        let result = questions.map((row) => new QuestionDao(row));

        result = result.map((t) => mapperUnSelect(t, ["created_at", "updated_at"]));

        result = await Promise.all(
            result.map(async (question) => {
                const [part, questionType, tags, answers] = await Promise.all([
                    partModel.findById(question.part_id),
                    questionTypeModel.findById(question.question_type_id),
                    questionTagModel.findByQuestionId(question.question_id, true),
                    answerModel.findByQuestionId(question.question_id, true),
                ]);

                return {
                    ...question,
                    question_audio: parseValueToJson({ value: question.question_audio }),
                    question_image: parseValueToJson({ value: question.question_image }),
                    part: mapperUnSelect(part, ["created_at", "updated_at"]),
                    questionType: mapperUnSelect(questionType, ["created_at", "updated_at"]),
                    tags,
                    answers,
                };
            })
        );

        const resultLength = result.length;
        const newResults = [];
        let questionOrders = [];
        let groupQuestionIdFlat = -1;

        for (let index = 0; index < resultLength; index++) {
            const question = result[index];

            // Get question order
            const indexQuestionOrder = questionOrders.findIndex(
                (item) => item.part_number === question.part.part_number
            );

            if (indexQuestionOrder === -1) {
                questionOrders.push({
                    part_number: question.part.part_number,
                    orders: [question.question_order],
                });
            } else {
                questionOrders[indexQuestionOrder] = {
                    ...questionOrders[indexQuestionOrder],
                    orders: [...questionOrders[indexQuestionOrder].orders, question.question_order],
                };
            }

            if (!question.group_question_id) {
                newResults.push(question);
            } else if (groupQuestionIdFlat !== question.group_question_id) {
                groupQuestionIdFlat = question.group_question_id;

                const groupQuestion = groupQuestions.find(
                    (item) => item.group_id === question.group_question_id
                );

                if (groupQuestion) {
                    newResults.push({
                        ...groupQuestion,
                        group_questions: [question],
                    });
                }
            } else {
                const index = newResults.findIndex(
                    (item) => item?.group_id === question.group_question_id
                );

                if (index === -1) continue;

                newResults[index] = {
                    ...newResults[index],
                    group_questions: [...newResults[index].group_questions, question],
                };
            }
        }

        return { questions: newResults, questionOrders };
    }
}

module.exports = { QuestionDao, questionModel: new QuestionModel() };
