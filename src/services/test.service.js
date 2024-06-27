"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { testModel } = require("../models/test.model");
const { generateSlug, generateRandomString } = require("../utils");

class TestService {
    static async create({ testName, testOfYear, duration }) {
        // Check if the tag already exists
        const foundTag = await testModel.findByName(testName);

        if (foundTag) {
            throw new ConflictRequestError("Tên bài thi đã tồn tại", undefined, {
                testName: "Tên bài thi đã tồn tại",
            });
        }

        const payload = {
            test_name: tagName,
            test_slug: generateSlug(tagName),
            test_of_year: testOfYear,
            test_duration: duration,
            test_tag: `#TOEIC-${testOfYear}`,
        };

        const newTag = await testModel.insert(payload);

        return newTag.insertId;
    }

    static async createMultipleWithUploadFile(tags = []) {
        if (!tags.length) throw new NotfoundRequestError("Vui lòng upload ít nhất 1 row");

        // Check if the tag already exists
        const foundTags = await testModel.findByNameMultiple(tags);

        if (foundTags.length) {
            throw new ConflictRequestError(
                "Có tag đã tồn tại",
                undefined,
                foundTags.map((t) => ({ tagName: t.tag_name }))
            );
        }

        // Create new tags
        const payload = tags.map((tag) => [
            tag.tagName,
            generateSlug(tag.tagName),
            generateRandomString(16),
        ]);

        const newTags = await testModel.insertBulk({
            data: payload,
            fields: ["tag_name", "tag_slug", "tag_id"],
        });

        return newTags;
    }

    static async update(testId, data) {
        // Check if the tag already exists
        const foundTag = await testModel.findByName(data.test_name);

        if (foundTag && foundTag.test_id !== testId) {
            throw new ConflictRequestError("Tên tag đã tồn tại", undefined, {
                tagName: "Tên tag đã tồn tại",
            });
        }

        const payload = {
            ...data,
            tag_slug: generateSlug(data.test_name),
        };

        return await testModel.updateById(testId, payload);
    }

    static async findById(testId) {
        const foundTest = await testModel.findById(testId);

        if (!foundTest) throw new NotfoundRequestError(`Không tìm thấy bài thi có id ${testId}`);

        return foundTest;
    }

    static async find(filters) {
        const { results, pagination } = await testModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }
}

module.exports = TestService;
