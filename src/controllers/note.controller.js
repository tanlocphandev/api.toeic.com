"use strict";

const { OK, Created } = require("../core/success.response");
const { checkOwn } = require("../helpers/auth.helper");
const { noteModel } = require("../models/note.model");
const NoteService = require("../services/note.service");

class NoteController {
    async create(req, res) {
        const { userId } = req.user;

        const note = await NoteService.create({ ...req.body, user_id: userId });

        return new Created({
            message: "Create note successfully",
            metadata: note,
        }).send(res);
    }

    async update(req, res) {
        const { noteId } = req.params;

        await checkOwn({
            key: "note_id",
            value: noteId,
            userId: req.user.userId,
            model: noteModel,
        });

        const note = await NoteService.update(noteId, req.body);

        return new OK({
            message: "Update note successfully",
            metadata: note,
        }).send(res);
    }

    async findById(req, res) {
        const { noteId } = req.params;
        const { userId } = req.user;

        await checkOwn({
            key: "note_id",
            value: noteId,
            userId: userId,
            model: noteModel,
        });

        const note = await NoteService.findById(noteId, userId);

        return new OK({
            message: "Find note successfully",
            metadata: note,
        }).send(res);
    }

    async find(req, res) {
        const { userId } = req.user;

        const query = {
            ...req.query,
            query: req.query ? `${req.query};user_id:${userId}` : `user_id:${userId}`,
        };

        const { results, pagination } = await NoteService.find(query);

        return new OK({
            message: "Find note successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }

    async delete(req, res) {
        const { userId } = req.user;

        await checkOwn({
            key: "note_id",
            value: req.params.noteId,
            userId: userId,
            model: noteModel,
        });

        return new OK({
            message: "Delete note successfully",
            metadata: await NoteService.delete(req.params.noteId, userId),
        }).send(res);
    }
}

module.exports = new NoteController();
