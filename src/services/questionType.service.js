"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { questionTypeModel } = require("../models/questionType.model");
const { questionModel } = require("../models/question.model");
const { generateSlug, mapValue, parseValueToJson } = require("../utils");
const cloudinary = require("../libs/cloudinary.lib");

class QuestionTypeService {
    static async findBySlug(slug) {
        const response = await questionTypeModel.findBySlug(slug);
        return response;
    }

    static async create({ typeName, partId, description = "", thumb = null }) {
        // Check if the type already exists
        const foundType = await questionTypeModel.findByName(typeName);

        if (foundType) {
            throw new ConflictRequestError("Tên loại câu hỏi đã tồn tại", undefined, {
                typeName: "Tên loại câu hỏi đã tồn tại",
            });
        }

        const payload = {
            type_name: typeName,
            type_slug: generateSlug(typeName),
            part_id: partId,
            type_description: description,
            type_thumb: mapValue({ rawValue: thumb, isJson: true }),
        };

        const newType = await questionTypeModel.insert(payload);

        return newType.affectedRows > 0 ? true : false;
    }

    static async createMultipleWithUploadFile(types = []) {
        if (!types.length) throw new NotfoundRequestError("Vui lòng upload ít nhất 1 row");

        // Check if the type already exists
        const foundTypes = await questionTypeModel.findByNameMultiple(types);

        if (foundTypes.length) {
            throw new ConflictRequestError(
                "Có loại câu hỏi đã tồn tại",
                undefined,
                foundTypes.map((t) => ({ typeName: t.type_name }))
            );
        }

        // Create new types
        const payload = types.map((type) => [type.typeName]);

        const newTypes = await questionTypeModel.insertBulk({
            data: payload,
            fields: ["type_name"],
        });

        return newTypes;
    }

    static async update(typeId, { typeName, description = "", thumb = null }) {
        // Check if the type already exists
        const foundType = await questionTypeModel.findByName(typeName);

        if (foundType && foundType.type_id !== +typeId) {
            throw new ConflictRequestError("Tên loại câu hỏi đã tồn tại", undefined, {
                typeName: "Tên loại câu hỏi đã tồn tại",
            });
        }

        let foundTypeInQuestion = await questionTypeModel.findOne({
            type_id: typeId,
        });

        if (!foundTypeInQuestion) {
            throw new NotfoundRequestError(`Không tìm thấy loại câu hỏi có id ${typeId}`);
        }

        const payload = {
            type_name: typeName,
            type_slug: generateSlug(typeName),
        };

        if (description) payload.type_desc = description;

        if (thumb) {
            payload.type_thumb = mapValue({ rawValue: thumb, isJson: true });

            foundTypeInQuestion = {
                ...foundTypeInQuestion,
                type_thumb: parseValueToJson({ value: foundTypeInQuestion.type_thumb }),
            };

            if (foundTypeInQuestion.type_thumb?.public_id) {
                // remove file from cloudinary
                await cloudinary.destroy(foundDoc.doc_video?.public_id);
            }
        }

        return await questionTypeModel.updateById(typeId, payload);
    }

    static async findById(typeId) {
        const foundType = await questionTypeModel.findById(typeId);

        if (!foundType)
            throw new NotfoundRequestError(`Không tìm thấy loại câu hỏi có id ${typeId}`);

        return foundType;
    }

    static async find(filters) {
        const { results, pagination } = await questionTypeModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }

    static async delete(typeId) {
        // Check if the type already exists
        const foundType = await questionTypeModel.findById(typeId);

        if (!foundType) {
            throw new NotfoundRequestError(`Không tìm thấy loại câu hỏi có id ${typeId}`);
        }

        const foundTypeInQuestion = await questionModel.findOne({
            question_type_id: typeId,
        });

        if (foundTypeInQuestion) {
            throw new NotfoundRequestError("Loại câu hỏi đang được sử dụng vào câu hỏi");
        }

        if (foundType.type_thumb?.public_id) {
            // remove file from cloudinary
            await cloudinary.destroy(foundType.type_thumb?.public_id);
        }

        const deleted = await questionTypeModel.deleteOne({ type_id: typeId });

        return deleted.affectedRows;
    }
}

module.exports = QuestionTypeService;
