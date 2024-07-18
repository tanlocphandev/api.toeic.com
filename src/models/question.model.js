"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { generateSlug, filterPropOutsideInstance } = require("../utils");

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
}

module.exports = { QuestionDao, questionModel: new QuestionModel() };
