"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");

class ExamDao extends SoftDeleteModel {
    constructor({
        exam_id,
        exam_total_question,
        exam_count_question_correct,
        exam_count_question_wrong,
        exam_count_question_skip,
        exam_type,
        exam_used_timer,
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
        this.exam_count_question_wrong = exam_count_question_wrong;
        this.exam_count_question_skip = exam_count_question_skip;
        this.exam_type = exam_type;
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
                exam_count_question_wrong: 1,
                exam_count_question_skip: 1,
                exam_type: 1,
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

    async findById(examId) {
        const response = await super.findOne({ exam_id: examId });

        if (!response) return null;

        return new ExamDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: ExamDao, fields: query });

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
}

module.exports = { ExamDao, examModel: new ExamModel() };
