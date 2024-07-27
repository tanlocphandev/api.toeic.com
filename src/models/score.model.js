"use strict";

const { raw } = require("mysql2");
const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");

class ScoreDao extends SoftDeleteModel {
    constructor({ score_id, score_name, score_status, created_at, updated_at, deleted_at }) {
        super({ created_at, updated_at, deleted_at });

        this.score_id = score_id;
        this.score_name = score_name;
        this.score_status = score_status;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                score_id: 1,
                score_name: 1,
                score_status: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class ScoreModel extends BaseModel {
    get tableName() {
        return "scores";
    }

    get idColumn() {
        return "score_id";
    }

    async findByName(name) {
        const response = await super.findOne({
            score_name: name,
        });

        if (!response) return null;

        return new ScoreDao(response);
    }

    async findById(scoreId) {
        const response = await super.findOne({ score_id: scoreId });

        if (!response) return null;

        return new ScoreDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order, isGetAll } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: ScoreDao, fields: query });

        if (isGetAll) {
            const response = await super.find(where, order);

            let results = response.map((row) => new ScoreDao(row));

            return { results, pagination: null };
        }

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new ScoreDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { ScoreDao, scoreModel: new ScoreModel() };
