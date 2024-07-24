"use strict";

const { OK, Created } = require("../core/success.response");
const ScoreService = require("../services/score.service");

class ScoreController {
    async create(req, res) {
        const score = await ScoreService.create(req.body);

        return new Created({
            message: "Create score successfully",
            metadata: score,
        }).send(res);
    }

    async update(req, res) {
        const { scoreId } = req.params;
        const score = await ScoreService.update(scoreId, req.body);

        return new OK({
            message: "Update score successfully",
            metadata: score,
        }).send(res);
    }

    async findById(req, res) {
        const { scoreId } = req.params;
        const score = await ScoreService.findById(scoreId);

        return new OK({
            message: "Find score successfully",
            metadata: score,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await ScoreService.find(req.query);

        return new OK({
            message: "Find score successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new ScoreController();
