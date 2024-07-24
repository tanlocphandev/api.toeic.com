"use strict";

const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { scoreModel } = require("../models/score.model");
const { scoreDetailsModel } = require("../models/scoreDetail.model");
const Transaction = require("../db/transaction.db");

class ScoreService {
    static async create({ scoreName, scores = [] }) {
        const connection = await Transaction.startTransaction();

        try {
            // select data score status active
            const foundScoreActive = await Transaction.findOne({
                tableName: scoreModel.tableName,
                conditions: {
                    score_status: "active",
                },
                connection,
            });

            // prepare data insert score
            const payload = {
                score_name: scoreName,
                score_status: foundScoreActive ? "inactive" : "active",
            };

            // create new score
            const newScore = await Transaction.insert({
                data: payload,
                tableName: scoreModel.tableName,
                connection,
            });

            // prepare data insert score detail
            const payloadDetail = scores.map((score) => {
                // prepare data insert score detail

                const payload = {
                    number_correct_answer: score.number_correct_answer,
                    reading_score: score.reading_score,
                    listening_score: score.listening_score,
                    score_id: newScore.insertId,
                };

                return Object.values(payload);
            });

            // create new score detail
            await Transaction.insertBulk({
                data: payloadDetail,
                tableName: scoreDetailsModel.tableName,
                fields: ["number_correct_answer", "reading_score", "listening_score", "score_id"],
                connection,
            });

            await Transaction.commit(connection);

            return newScore.insertId;
        } catch (error) {
            console.log(`Error in create new score:::`, error);
            await Transaction.rollback(connection);
            throw error;
        } finally {
            await Transaction.release(connection);
        }
    }

    static async update(scoreId, body) {
        return await scoreModel.updateById(scoreId, body);
    }

    static async findById(scoreId) {
        const foundTag = await scoreModel.findById(scoreId);

        if (!foundTag) throw new NotfoundRequestError(`Không tìm thấy bảng điểm có id ${scoreId}`);

        return foundTag;
    }

    static async find(filters) {
        const { results, pagination } = await scoreModel.find(filters);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results,
            pagination: pagination,
        };
    }
}

module.exports = ScoreService;
