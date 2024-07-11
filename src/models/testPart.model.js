"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { generateSlug, filterPropOutsideInstance } = require("../utils");

class TestPartDao extends TimestampModel {
    constructor({ part_id, test_id, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.test_id = test_id;
        this.part_id = part_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                test_id: 1,
                part_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class TestPartModel extends BaseModel {
    get tableName() {
        return "tests_parts";
    }

    get idColumn() {
        return "test_id";
    }

    async findById({ testId, partId }) {
        const response = await super.findOne({ test_id: testId, part_id: partId });

        if (!response) return null;

        return new TestPartDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: TestPartDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new TestPartDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

module.exports = { TestPartDao, testPartModel: new TestPartModel() };
