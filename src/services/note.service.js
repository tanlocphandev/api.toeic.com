"use strict";

const {
    ConflictRequestError,
    NotfoundRequestError,
    AuthFailureError,
} = require("../core/error.response");
const { noteModel } = require("../models/note.model");

class NoteService {
    static async create({ user_id, note_name }) {
        // Check if the note already exists
        const foundNote = await noteModel.findOne({
            user_id,
            note_name,
        });

        if (foundNote) {
            throw new ConflictRequestError("Mục ghi chú đã tồn tại", undefined, {
                note_name: "Mục ghi chú đã tồn tại",
            });
        }

        const payload = {
            user_id,
            note_name,
        };

        const newNote = await noteModel.insert(payload);

        return newNote.insertId;
    }

    static async update(noteId, data) {
        const response = await noteModel.updateById(noteId, data);
        return response.affectedRows;
    }

    static async findById(noteId, userId, include) {
        let foundPart = await noteModel.findOne({
            note_id: noteId,
            user_id: userId,
        });

        if (!foundPart) throw new NotfoundRequestError(`Không tìm thấy note có id ${noteId}`);

        if (!include) return foundPart;

        foundPart = await noteModel._findInclude(foundPart);

        return foundPart;
    }

    static async find(filters) {
        const { results, pagination } = await noteModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }

    static async delete(noteId, userId) {
        const foundNote = await noteModel.findOne({ note_id: noteId, user_id: userId });

        if (!foundNote) throw new NotfoundRequestError(`Không tìm thấy note có id ${noteId}`);

        const response = await noteModel.deleteOne({ note_id: noteId });

        return response.affectedRows;
    }
}

module.exports = NoteService;
