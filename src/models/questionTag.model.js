"ust strict";

const QueryHelper = require("../helpers/query.helper");
const SoftDeleteModel = require("./common/softDelete.model");
const BaseModel = require("./base.model");
const { filterPropOutsideInstance, mapperUnSelect } = require("../utils");
const { tagModel } = require("./tag.model");

class QuestionTagDao extends SoftDeleteModel {
    constructor({ question_id, tag_id, created_at, updated_at, deleted_at }) {
        super({ created_at, updated_at, deleted_at });

        this.question_id = question_id;
        this.tag_id = tag_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                question_id: 1,
                tag_id: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class QuestionTagModel extends BaseModel {
    get tableName() {
        return "questions_tags";
    }

    get idColumn() {
        return "question_id";
    }

    async findById({ questionId, tagId }) {
        const response = await super.findOne({ question_id: questionId, tag_id: tagId });

        if (!response) return null;

        const result = new QuestionTagDao(response);

        return result;
    }

    async findByQuestionId(questionId, isHiddenTime = false) {
        const response = await super.find({ question_id: questionId });

        if (!response.length) return [];

        let results = response.map((row) => new QuestionTagDao(row));

        results = await Promise.all(
            results.map(async (question) => {
                const tag = await tagModel.findById(question.tag_id);
                return { ...question, tag };
            })
        );

        if (!isHiddenTime) return results;

        return results.map((t) => {
            const tag = mapperUnSelect(t.tag, ["created_at", "updated_at"]);

            return {
                ...mapperUnSelect(t, ["created_at", "updated_at"]),
                tag,
            };
        });
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: QuestionTagDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new QuestionTagDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { QuestionTagDao, questionTagModel: new QuestionTagModel() };
