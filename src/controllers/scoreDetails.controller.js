"use strict";

const { OK, Created } = require("../core/success.response");
const ScoreDetailsService = require("../services/scoreDetails.service");

class ScoreDetailsController {
    async create(req, res) {
        const score = await ScoreDetailsService.create(req.body);

        return new Created({
            message: "Create score successfully",
            metadata: score,
        }).send(res);
    }

    async update(req, res) {
        const { scoreId } = req.params;
        const score = await ScoreDetailsService.update(scoreId, req.body);

        return new OK({
            message: "Update score details successfully",
            metadata: score,
        }).send(res);
    }

    async findById(req, res) {
        const { scoreId } = req.params;
        const score = await ScoreDetailsService.findById(scoreId);

        return new OK({
            message: "Find score successfully",
            metadata: score,
        }).send(res);
    }

    async find(req, res) {
        const { results, pagination } = await ScoreDetailsService.find(req.query);

        return new OK({
            message: "Find score detail successfully",
            metadata: results,
            options: pagination,
        }).send(res);
    }
}

module.exports = new ScoreDetailsController();
