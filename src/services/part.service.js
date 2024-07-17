"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { partModel } = require("../models/part.model");
const { generateSlug, generateRandomString } = require("../utils");

class PartService {
    static async create({ partName, partNumber }) {
        // Check if the part already exists
        const foundPart = await partModel.findByName(partName);

        if (foundPart) {
            throw new ConflictRequestError("Tên part đã tồn tại", undefined, {
                partName: "Tên part đã tồn tại",
            });
        }

        const payload = {
            part_name: partName,
            part_slug: generateSlug(partName),
            part_id: generateRandomString(16),
            part_number: partNumber,
        };

        const newPart = await partModel.insert(payload);

        return newPart.affectedRows > 0 ? true : false;
    }

    static async createMultipleWithUploadFile(parts = []) {
        if (!parts.length) throw new NotfoundRequestError("Vui lòng upload ít nhất 1 row");

        // Check if the part already exists
        const foundParts = await partModel.findByNameMultiple(parts);

        if (foundParts.length) {
            throw new ConflictRequestError(
                "Có part đã tồn tại",
                undefined,
                foundParts.map((t) => ({ partName: t.part_name }))
            );
        }

        // Create new parts
        const payload = parts.map((part) => [
            part.partName,
            part.partNumber,
            generateSlug(part.partName),
            generateRandomString(16),
        ]);

        const newParts = await partModel.insertBulk({
            data: payload,
            fields: ["part_name", "part_number", "part_slug", "part_id"],
        });

        return newParts;
    }

    static async update(partId, { partName }) {
        // Check if the part already exists
        const foundPart = await partModel.findByName(partName);

        if (foundPart && foundPart.part_id !== partId) {
            throw new ConflictRequestError("Tên part đã tồn tại", undefined, {
                partName: "Tên part đã tồn tại",
            });
        }

        const payload = {
            part_name: partName,
            part_slug: generateSlug(partName),
        };

        return await partModel.updateById(partId, payload);
    }

    static async findById(partId) {
        const foundPart = await partModel.findById(partId);

        if (!foundPart) throw new NotfoundRequestError(`Không tìm thấy part có id ${partId}`);

        return foundPart;
    }

    static async find(filters) {
        const { results, pagination } = await partModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }
}

module.exports = PartService;
