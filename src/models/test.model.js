"use strict";

const QueryHelper = require("../helpers/query.helper");
const { generateSlug, filterPropOutsideInstance } = require("../utils");
const BaseModel = require("./base.model");
const SoftDeleteModel = require("./common/softDelete.model");

class TestDao extends SoftDeleteModel {
    constructor({
        test_id,
        test_name,
        test_slug,
        test_of_year,
        test_duration,
        test_comment_count,
        test_user_count,
        test_question_count,
        test_tag,
        test_audio,
        test_no_of_year,
        created_at,
        updated_at,
        deleted_at,
    }) {
        super({ created_at, updated_at, deleted_at });

        this.test_id = test_id;
        this.test_name = test_name;
        this.test_slug = test_slug;
        this.test_of_year = test_of_year;
        this.test_duration = test_duration;
        this.test_comment_count = test_comment_count;
        this.test_user_count = test_user_count;
        this.test_question_count = test_question_count;
        this.test_tag = test_tag;
        this.test_audio = test_audio;
        this.test_no_of_year = test_no_of_year;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                test_id: 1,
                test_name: 1,
                test_slug: 1,
                test_of_year: 1,
                test_duration: 1,
                test_comment_count: 1,
                test_user_count: 1,
                test_question_count: 1,
                test_tag: 1,
                test_audio: 1,
                test_no_of_year: 1,
                created_at: 1,
                updated_at: 1,
                deleted_at: 1,
            });
        }

        return this.instance;
    }
}

class TestModel extends BaseModel {
    get tableName() {
        return "tests";
    }

    get idColumn() {
        return "test_id";
    }

    async findByName(name) {
        const testSlug = generateSlug(name);

        const response = await super.findOne({ part_name: name, part_slug: testSlug });

        if (!response) return null;

        return new TestDao(response);
    }

    async findByNameMultiple(testNames = []) {
        const testNamesParser = testNames.map(({ testName }) => testName);

        if (!testNamesParser.length) return [];

        const partSlugs = testNamesParser.map((name) => generateSlug(name));

        const response = await super.find({
            test_name: { "IN (?)": testNamesParser },
            test_slug: { "IN (?)": partSlugs },
        });

        if (!response.length) return [];

        return response.map((row) => new TestDao(row));
    }

    async findById(testId) {
        const response = await super.findOne({ test_id: testId });

        if (!response) return null;

        return new TestDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: TestDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new TestDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { TestDao, testModel: new TestModel() };
