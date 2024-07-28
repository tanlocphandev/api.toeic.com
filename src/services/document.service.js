"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { documentModel } = require("../models/document.model");
const { mapValue, filterInvalidProperties } = require("../utils");

class DocumentService {
    static async create({
        doc_title,
        doc_type,
        doc_desc,
        doc_audio = null,
        doc_video = null,
        doc_text = null,
        doc_link = null,
        doc_pdf = null,
        doc_thumbnail = null,
    }) {
        // Check if the document already exists
        const foundDoc = await documentModel.findOne({
            doc_title,
            doc_type,
        });

        if (foundDoc) {
            throw new ConflictRequestError("Tiêu đề và loại tài liệu đã tồn tại", undefined, {
                doc_title: "Tiêu đề và loại tài liệu đã tồn tại",
                doc_type: "Tiêu đề và loại tài liệu đã tồn tại",
            });
        }

        const payload = {
            doc_title,
            doc_type,
            doc_desc,
            doc_audio: mapValue({ raw: doc_audio, isJson: true }),
            doc_video: mapValue({ raw: doc_video, isJson: true }),
            doc_text: mapValue({ raw: doc_text }),
            doc_link: mapValue({ raw: doc_link }),
            doc_pdf: mapValue({ raw: doc_pdf, isJson: true }),
            doc_thumbnail: mapValue({ raw: doc_thumbnail, isJson: true }),
        };

        const newDoc = await documentModel.insert(payload);

        return newDoc.insertId;
    }

    static async update(docId, body) {
        const newBody = filterInvalidProperties(body);

        if (newBody.doc_title && newBody.doc_type) {
            // Check if the document already exists
            const foundDoc = await documentModel.findOne({
                doc_title: newBody.doc_title,
                doc_type: newBody.doc_type,
            });

            if (foundDoc && foundDoc.doc_id !== docId) {
                throw new ConflictRequestError("Tiêu đề và loại tài liệu đã tồn tại", undefined, {
                    title: "Tiêu đề và loại tài liệu đã tồn tại",
                    type: "Tiêu đề và loại tài liệu đã tồn tại",
                });
            }
        }

        return await documentModel.updateById(docId, newBody);
    }

    static async findById(docId) {
        const foundDoc = await documentModel.findById(docId);

        if (!foundDoc) throw new NotfoundRequestError(`Không tìm thấy tag có id ${docId}`);

        return foundDoc;
    }

    static async find(filters) {
        const { results, pagination } = await documentModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }

    static async delete(docId) {
        return "ok";
    }
}

module.exports = DocumentService;
