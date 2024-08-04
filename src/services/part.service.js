"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { partModel } = require("../models/part.model");
const { generateSlug, generateRandomString } = require("../utils");
const { testPartModel } = require("../models/testPart.model");
const { questionTypeModel } = require("../models/questionType.model");

class PartService {
    static async create({ partName, partNumber, description }) {
        // Check if the part already exists
        const foundPart = await partModel.findByName(partName);

        if (foundPart) {
            throw new ConflictRequestError("Tên part đã tồn tại", undefined, {
                partName: "Tên part đã tồn tại",
            });
        }

        const foundPartNumber = await partModel.findOne({
            part_number: partNumber,
        });

        if (foundPartNumber) {
            throw new ConflictRequestError("Số part đã tồn tại", undefined, {
                partNumber: "Số part đã tồn tại",
            });
        }

        const payload = {
            part_name: partName,
            part_slug: generateSlug(partName),
            part_id: generateRandomString(16),
            part_number: partNumber,
            part_desc: description,
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

    static async update(partId, { partName, description = "", partNumber = -1 }) {
        // Check if the part already exists
        const foundPart = await partModel.findByName(partName);

        if (foundPart && foundPart.part_id !== partId) {
            throw new ConflictRequestError("Tên part đã tồn tại", undefined, {
                partName: "Tên part đã tồn tại",
            });
        }

        let payload = {
            part_name: partName,
            part_slug: generateSlug(partName),
        };

        if (partNumber !== -1) {
            const foundPartNumber = await partModel.findOne({
                part_number: partNumber,
            });

            if (foundPartNumber && foundPartNumber.part_id !== partId) {
                throw new ConflictRequestError("Số part đã tồn tại", undefined, {
                    partNumber: "Số part đã tồn tại",
                });
            }

            payload = {
                ...payload,
                part_number: partNumber,
            };
        }

        if (description) payload = { ...payload, part_desc: description };

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

    static async delete(partId) {
        const foundPart = await partModel.findById(partId);

        if (!foundPart) throw new NotfoundRequestError(`Không tìm thấy part có id ${partId}`);

        const [foundForeignTest, foundForeignQuestion] = await Promise.all([
            testPartModel.findOne({ part_id: partId }),
            questionTypeModel.findOne({ part_id: partId }),
        ]);

        if (foundForeignTest) {
            throw new ConflictRequestError(
                "Không thể xóa part vì đang được sử dụng trong bài kiểm tra",
                undefined,
                {
                    partName: foundPart.part_name,
                }
            );
        }

        if (foundForeignQuestion) {
            throw new ConflictRequestError(
                "Không thể xóa part vì đang được sử dụng trong câu hỏi",
                undefined,
                {
                    partName: foundPart.part_name,
                }
            );
        }

        const deletedPart = await partModel.deleteOne({ part_id: partId });

        return deletedPart.affectedRows;
    }
}

module.exports = PartService;
