"use strict";

const { AnswerDao } = require("../models/answer.model");
const { randomNumber } = require("../utils");

class AnswerService {
    static createAnswerTemp({ order, text, isCorrect }) {
        return new AnswerDao({
            answer_id: randomNumber(),
            answer_image: null,
            answer_isCorrect: isCorrect,
            answer_order: order,
            answer_text: text,
            question_id: 1,
            created_at: 1,
            updated_at: 1,
        });
    }

    static hasCorrectAnswer(answerText, correctText) {
        return answerText === correctText;
    }
}

module.exports = AnswerService;
