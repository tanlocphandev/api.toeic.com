"use strict";

const { NotfoundRequestError } = require("../core/error.response");
const { noteDetailsModel } = require("../models/noteDetails.model");

class NoteDetailsService {
    static async create({ note_id, detail_title, detail_content }) {
        const payload = { note_id, detail_title, detail_content };

        const newNoteDetails = await noteDetailsModel.insert(payload);

        return newNoteDetails.insertId;
    }

    static async update(detailId, data) {
        const response = await noteDetailsModel.updateById(detailId, data);
        return response.affectedRows;
    }

    static async findById(detailId, include) {
        const foundNoteDetails = await noteDetailsModel.findById(detailId, include);

        if (!foundNoteDetails)
            throw new NotfoundRequestError(`Không tìm thấy ghi chú chi tiết có id ${detailId}`);

        return foundNoteDetails;
    }

    static async find(filters) {
        const { results, pagination } = await noteDetailsModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }

    static async delete(detailId) {
        const response = await noteDetailsModel.deleteOne({ detail_id: detailId });
        return response.affectedRows;
    }
}

module.exports = NoteDetailsService;
