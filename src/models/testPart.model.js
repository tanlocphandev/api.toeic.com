"ust strict";

const QueryHelper = require("../helpers/query.helper");
const TimestampModel = require("./common/timestamp.model");
const BaseModel = require("./base.model");
const { filterPropOutsideInstance } = require("../utils");
const { testModel } = require("./test.model");
const { partModel } = require("./part.model");
const { examModel } = require("./exam.model");
const { questionTypeModel } = require("./questionType.model");

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

        const testPart = new TestPartDao(response);

        const [test, part] = await Promise.all([
            testModel.findById(testPart.test_id),
            partModel.findById(testPart.part_id),
        ]);

        return { ...testPart, test, part };
    }

    _percentCorrect(maxCorrectExam) {
        if (!maxCorrectExam) return 0;

        const { exam_total_question, exam_count_question_correct } = maxCorrectExam;

        return Math.round((exam_count_question_correct / exam_total_question) * 100);
    }

    async findByPartId({ partId, userId, questionSlug }) {
        const [response, questionType] = await Promise.all([
            super.find({ part_id: partId }),
            questionTypeModel.findBySlug(questionSlug),
        ]);

        if (!response.length) return [];

        let result = response.map((row) => new TestPartDao(row));

        result = await Promise.all(
            result.map(async (t) => {
                const [test, part, maxCorrectExam, countJoinExam] = await Promise.all([
                    testModel.findById(t.test_id),
                    partModel.findById(t.part_id),
                    examModel.maxRow({
                        conditions: {
                            test_id: t.test_id,
                            user_id: userId,
                            question_type_id: questionType.type_id,
                        },
                        column: "exam_count_question_correct",
                        idColumn: "exam_id",
                    }),
                    examModel.count({
                        test_id: t.test_id,
                        user_id: userId,
                        question_type_id: questionType.type_id,
                    }),
                ]);

                return {
                    ...t,
                    test,
                    part,
                    countJoinExam,
                    maxCorrectExam,
                    percentCorrect: this._percentCorrect(maxCorrectExam),
                };
            })
        );

        return result;
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
