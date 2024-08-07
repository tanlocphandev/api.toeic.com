"use strict";

const QueryHelper = require("../helpers/query.helper");
const { filterPropOutsideInstance, parseValueToJson } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");
const { partModel } = require("./part.model");

class QuestionTypeDao extends TimestampModel {
    constructor({
        type_id,
        type_name,
        part_id,
        type_slug,
        type_desc,
        type_thumb,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.type_id = type_id;
        this.type_name = type_name;
        this.type_desc = type_desc;
        this.type_thumb = type_thumb;
        this.part_id = part_id;
        this.type_slug = type_slug;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                type_id: 1,
                type_name: 1,
                part_id: 1,
                type_desc: 1,
                type_thumb: 1,
                type_slug: 1,
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

    async findBySlug(slug) {
        const response = await super.findOne({ type_slug: slug });

        const result = new QuestionTypeDao(response);

        const part = await partModel.findById(result.part_id);

        return { ...result, part, type_thumb: parseValueToJson({ value: result.type_thumb }) };
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

        const result = new QuestionTypeDao(response);

        const part = await partModel.findById(result.part_id);

        return { ...result, part, type_thumb: parseValueToJson({ value: result.type_thumb }) };
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

        let results = data.map((row) => new QuestionTypeDao(row));

        results = await Promise.all(
            results.map(async (row) => {
                const part = await partModel.findById(row.part_id);
                return { ...row, part, type_thumb: parseValueToJson({ value: row.type_thumb }) };
            })
        );

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { QuestionTypeDao, questionTypeModel: new QuestionTypeModel() };
