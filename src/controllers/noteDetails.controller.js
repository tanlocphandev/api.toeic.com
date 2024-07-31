"use strict";

const { OK, Created } = require("../core/success.response");
const NotedDetailsService = require("../services/noteDetails.service");

class NoteDetailsController {
    async create(req, res) {
        const noteDetails = await NotedDetailsService.create(req.body);

        return new Created({
            message: "Create noteDetails successfully",
            metadata: noteDetails,
        }).send(res);
    }

    async update(req, res) {
        const { noteDetailsId } = req.params;
        const noteDetails = await NotedDetailsService.update(noteDetailsId, req.body);

        return new OK({
            message: "Update noteDetails successfully",
            metadata: noteDetails,
        }).send(res);
    }

    async findById(req, res) {
        const { noteDetailsId } = req.params;
        const noteDetails = await NotedDetailsService.findById(
            noteDetailsId,
            req.query.include || false
        );

        return new OK({
            message: "Find noteDetails successfully",
            metadata: noteDetails,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await NotedDetailsService.find(req.query);

        return new OK({
            message: "Find noteDetails successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }

    async delete(req, res) {
        return new OK({
            message: "Delete noteDetails successfully",
            metadata: await NotedDetailsService.delete(req.params.noteDetailsId),
        }).send(res);
    }
}

module.exports = new NoteDetailsController();
