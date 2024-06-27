"use strict";

const QueryHelper = require("../helpers/query.helper");
const { generateSlug, filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class TagDao extends TimestampModel {
    constructor({ tag_id, tag_name, tag_slug, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.tag_id = tag_id;
        this.tag_name = tag_name;
        this.tag_slug = tag_slug;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                tag_id: 1,
                tag_name: 1,
                tag_slug: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class TagModel extends BaseModel {
    get tableName() {
        return "tags";
    }

    get idColumn() {
        return "tag_id";
    }

    async findByName(name) {
        const tagSlug = generateSlug(name);

        const response = await super.findOne({ tag_name: name, tag_slug: tagSlug });

        if (!response) return null;

        return new TagDao(response);
    }

    async findByNameMultiple(tagNames = []) {
        const tagNamesParser = tagNames.map(({ tagName }) => tagName);

        if (!tagNamesParser.length) return [];

        const tagSlugs = tagNamesParser.map((name) => generateSlug(name));

        const response = await super.find({
            tag_name: { "IN (?)": tagNamesParser },
            tag_slug: { "IN (?)": tagSlugs },
        });

        if (!response.length) return [];

        return response.map((row) => new TagDao(row));
    }

    async findById(tagId) {
        const response = await super.findOne({ tag_id: tagId });

        if (!response) return null;

        return new TagDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: TagDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new TagDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { TagDao, tagModel: new TagModel() };
