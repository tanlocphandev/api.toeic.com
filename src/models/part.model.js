"use strict";

const QueryHelper = require("../helpers/query.helper");
const { generateSlug, filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./timestamp.model");

class PartDao extends TimestampModel {
    constructor({ part_id, part_name, part_slug, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.part_id = part_id;
        this.part_name = part_name;
        this.part_slug = part_slug;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                part_id: 1,
                part_name: 1,
                part_slug: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class PartModel extends BaseModel {
    get tableName() {
        return "parts";
    }

    get idColumn() {
        return "part_id";
    }

    async findByName(name) {
        const partSlug = generateSlug(name);

        const response = await super.findOne({ part_name: name, part_slug: partSlug });

        if (!response) return null;

        return new PartDao(response);
    }

    async findByNameMultiple(partNames = []) {
        const partNamesParser = partNames.map(({ partName }) => partName);

        if (!partNamesParser.length) return [];

        const partSlugs = partNamesParser.map((name) => generateSlug(name));

        const response = await super.find({
            part_name: { "IN (?)": partNamesParser },
            part_slug: { "IN (?)": partSlugs },
        });

        if (!response.length) return [];

        return response.map((row) => new PartDao(row));
    }

    async findById(partId) {
        const response = await super.findOne({ part_id: partId });

        if (!response) return null;

        return new PartDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: PartDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new PartDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { PartDao, partModel: new PartModel() };
