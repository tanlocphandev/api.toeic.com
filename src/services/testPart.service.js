"use strict";

const { testPartModel } = require("../models/testPart.model");

class TestPartService {
    static async getByPartId(partId) {
        const results = await testPartModel.findByPartId(partId);

        const years = [];

        const resultLength = results.length;

        for (let i = 0; i < resultLength; i++) {
            const year = results[i].test.test_of_year;

            if (!years.includes(year)) {
                years.push(year);
            }
        }

        return { results: results, years };
    }

    static async getById(partId, testId) {
        const results = await testPartModel.findById({ partId, testId });
        return results;
    }
}

module.exports = TestPartService;
