"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");

class ScoreDetailsDao extends SoftDeleteModel {
    constructor({
        details_id,
        reading_score,
        listening_score,
        number_correct_answer,
        score_id,
        created_at,
        updated_at,
        deleted_at,
    }) {
        super({ created_at, updated_at, deleted_at });

        this.score_id = score_id;
        this.details_id = details_id;
        this.reading_score = reading_score;
        this.listening_score = listening_score;
        this.number_correct_answer = number_correct_answer;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                score_id: 1,
                details_id: 1,
                reading_score: 1,
                listening_score: 1,
                number_correct_answer: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class ScoreDetailsModel extends BaseModel {
    get tableName() {
        return "score_details";
    }

    get idColumn() {
        return "details_id";
    }

    async findById(detailId) {
        const response = await super.findOne({ details_id: detailId });

        if (!response) return null;

        return new ScoreDetailsDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: ScoreDetailsDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new ScoreDetailsDao(row));

            return { results, pagination: null };
        }

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new ScoreDetailsDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { ScoreDetailsDao, scoreDetailsModel: new ScoreDetailsModel() };
