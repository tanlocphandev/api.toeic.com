"use strict";

const {
    ConflictRequestError,
    NotfoundRequestError,
    BadRequestError,
} = require("../core/error.response");
const { documentModel } = require("../models/document.model");
const { mapValue, filterInvalidProperties, generateSlug } = require("../utils");
const cloudinary = require("../libs/cloudinary.lib");

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
        // throw new BadRequestError(`Maintained in next version!`);

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
            doc_slug: generateSlug(doc_title),
            doc_type,
            doc_desc,
            doc_audio: mapValue({ rawValue: doc_audio, isJson: true }),
            doc_video: mapValue({ rawValue: doc_video, isJson: true }),
            doc_text: mapValue({ rawValue: doc_text }),
            doc_link: mapValue({ rawValue: doc_link }),
            doc_pdf: mapValue({ rawValue: doc_pdf, isJson: true }),
            doc_thumbnail: mapValue({ rawValue: doc_thumbnail, isJson: true }),
        };

        const newDoc = await documentModel.insert(payload);

        return newDoc.insertId;
    }

    static async update(docId, body) {
        const newBody = filterInvalidProperties(body);
        const foundDoc = await documentModel.findById(docId);

        if (!foundDoc) throw new NotfoundRequestError(`Không tìm thấy tài liệu có id ${docId}`);

        if (newBody.doc_title && newBody.doc_type) {
            // Check if the document already exists
            const foundDoc = await documentModel.findOne({
                doc_title: newBody.doc_title,
                doc_type: newBody.doc_type,
            });

            if (foundDoc && foundDoc.doc_id !== +docId) {
                throw new ConflictRequestError("Tiêu đề và loại tài liệu đã tồn tại", undefined, {
                    title: "Tiêu đề và loại tài liệu đã tồn tại",
                    type: "Tiêu đề và loại tài liệu đã tồn tại",
                });
            }
        }

        if (newBody.doc_title) newBody.doc_slug = generateSlug(newBody.doc_title);

        if (newBody.doc_type) newBody.doc_type = newBody.doc_type.toLowerCase();

        if (newBody.doc_audio) {
            if (
                foundDoc.doc_audio?.public_id &&
                newBody.doc_audio?.public_id !== foundDoc.doc_audio?.public_id
            ) {
                // remove file from cloudinary
                await cloudinary.destroy(foundDoc.doc_audio?.public_id);
            }

            newBody.doc_audio = mapValue({ rawValue: newBody.doc_audio, isJson: true });
        }

        if (newBody.doc_video) {
            if (
                foundDoc.doc_video?.public_id &&
                newBody.doc_video?.public_id !== foundDoc.doc_video?.public_id
            ) {
                // remove file from cloudinary
                await cloudinary.destroy(foundDoc.doc_video?.public_id);
            }

            newBody.doc_video = mapValue({ rawValue: newBody.doc_video, isJson: true });
        }

        if (newBody.doc_pdf) {
            if (
                foundDoc.doc_pdf?.public_id &&
                newBody.doc_pdf?.public_id !== foundDoc.doc_pdf?.public_id
            ) {
                // remove file from cloudinary
                await cloudinary.destroy(foundDoc.doc_pdf?.public_id);
            }

            newBody.doc_pdf = mapValue({ rawValue: newBody.doc_pdf, isJson: true });
        }

        if (newBody.doc_thumbnail) {
            if (
                foundDoc.doc_thumbnail?.public_id &&
                newBody.doc_thumbnail?.public_id !== foundDoc.doc_thumbnail?.public_id
            ) {
                // remove file from cloudinary
                await cloudinary.destroy(foundDoc.doc_thumbnail?.public_id);
            }

            newBody.doc_thumbnail = mapValue({ rawValue: newBody.doc_thumbnail, isJson: true });
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
        const foundDoc = await documentModel.findById(docId);
        if (!foundDoc) throw new NotfoundRequestError(`Không tìm thấy tài liệu có id ${docId}`);

        if (foundDoc.doc_audio?.public_id) {
            // remove file from cloudinary
            await cloudinary.destroy(foundDoc.doc_audio?.public_id);
        }

        if (foundDoc.doc_video?.public_id) {
            // remove file from cloudinary
            await cloudinary.destroy(foundDoc.doc_video?.public_id);
        }

        if (foundDoc.doc_pdf?.public_id) {
            // remove file from cloudinary
            await cloudinary.destroy(foundDoc.doc_pdf?.public_id);
        }

        if (foundDoc.doc_thumbnail?.public_id) {
            // remove file from cloudinary
            await cloudinary.destroy(foundDoc.doc_thumbnail?.public_id);
        }

        return await documentModel.deleteOne({ doc_id: docId });
    }
}

module.exports = DocumentService;
