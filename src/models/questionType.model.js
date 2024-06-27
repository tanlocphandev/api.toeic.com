"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class QuestionTypeDao extends TimestampModel {
    constructor({ type_id, type_name, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.type_id = type_id;
        this.type_name = type_name;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                type_id: 1,
                type_name: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class QuestionTypeModel extends BaseModel {
    get tableName() {
        return "question_types";
    }

    get idColumn() {
        return "type_id";
    }

    async findByName(name) {
        const response = await super.findOne({ type_name: name });

        if (!response) return null;

        return new QuestionTypeDao(response);
    }

    async findByNameMultiple(typeNames = []) {
        const typeNamesParser = typeNames.map(({ typeName }) => typeName);

        if (!typeNamesParser.length) return [];

        const response = await super.find({
            type_name: { "IN (?)": typeNamesParser },
        });

        if (!response.length) return [];

        return response.map((row) => new QuestionTypeDao(row));
    }

    async findById(typeId) {
        const response = await super.findOne({ type_id: typeId });

        if (!response) return null;

        return new QuestionTypeDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: QuestionTypeDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new QuestionTypeDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { QuestionTypeDao, questionTypeModel: new QuestionTypeModel() };
