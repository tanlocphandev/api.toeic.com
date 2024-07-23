"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { filterPropOutsideInstance, mapperUnSelect } = require("../utils");

class AnswerDao extends TimestampModel {
    constructor({
        answer_id,
        answer_text,
        answer_isCorrect,
        answer_order,
        answer_image,
        question_id,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.answer_id = answer_id;
        this.answer_text = answer_text;
        this.answer_isCorrect = answer_isCorrect;
        this.answer_order = answer_order;
        this.answer_image = answer_image;
        this.question_id = question_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                answer_id: 1,
                answer_text: 1,
                answer_isCorrect: 1,
                answer_order: 1,
                answer_image: 1,
                question_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class AnswerModel extends BaseModel {
    get tableName() {
        return "answers";
    }

    get idColumn() {
        return "answer_id";
    }

    async findById(answerId) {
        if (!answerId) return null;

        const response = await super.findOne({ answer_id: answerId });

        if (!response) return null;

        return new AnswerDao(response);
    }

    async findByAnswerOrder(answerOrder) {
        const response = await super.findOne({ answer_order: answerOrder });

        if (!response) return null;

        return new AnswerDao(response);
    }

    async findByQuestionId(questionId, isHiddenTime = false) {
        const response = await super.find(
            { question_id: questionId },
            { key: "answer_order", value: "asc" }
        );

        if (!response.length) return [];

        if (!isHiddenTime) return response.map((row) => new AnswerDao(row));

        const results = response.map((row) => new AnswerDao(row));

        return results.map((t) => mapperUnSelect(t, ["created_at", "updated_at"]));
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: AnswerDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new AnswerDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { AnswerDao, answerModel: new AnswerModel() };
