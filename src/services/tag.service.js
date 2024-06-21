"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { tagModel } = require("../models/tag.model");
const { generateSlug, generateRandomString } = require("../utils");

class TagService {
    static async create({ tagName }) {
        // Check if the tag already exists
        const foundTag = await tagModel.findByName(tagName);

        if (foundTag) {
            throw new ConflictRequestError("Tên tag đã tồn tại", undefined, {
                tagName: "Tên tag đã tồn tại",
            });
        }

        const payload = {
            tag_name: tagName,
            tag_slug: generateSlug(tagName),
            tag_id: generateRandomString(16, true),
        };

        return await tagModel.insert(payload);
    }

    static async update(tagId, { tagName }) {
        // Check if the tag already exists
        const foundTag = await tagModel.findByName(tagName);

        if (foundTag && foundTag.tag_id !== tagId) {
            throw new ConflictRequestError("Tên tag đã tồn tại", undefined, {
                tagName: "Tên tag đã tồn tại",
            });
        }

        const payload = {
            tag_name: tagName,
            tag_slug: generateSlug(tagName),
        };

        return await tagModel.updateById(tagId, payload);
    }

    static async findById(tagId) {
        const foundTag = await tagModel.findById(tagId);

        if (!foundTag) throw new NotfoundRequestError(`Không tìm thấy tag có id ${tagId}`);

        return foundTag;
    }

    static async find(filters) {
        const { results, pagination } = await tagModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }
}

module.exports = TagService;
