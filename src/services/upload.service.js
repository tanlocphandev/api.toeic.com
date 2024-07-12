"use strict";

const APP_CONFIGS = require("../configs/app.config");
const { BadRequestError, NotfoundRequestError } = require("../core/error.response");
const cloudinary = require("../libs/cloudinary.lib");
const { isUrl, filterExtFilePath, mapperUnSelect } = require("../utils");
const AnswerService = require("./answer.service");

const {
    FOLDER_AUDIO_QUESTION_LOCAL: FOLDER_AUDIO_QUESTION,
    FOLDER_IMAGE_QUESTION_LOCAL: FOLDER_IMAGE_QUESTION,
} = APP_CONFIGS;

const answerTexts = ["A", "B", "C", "D"];

class UploadServicer {
    static handleUploadQuestion(data = []) {
        if (!FOLDER_AUDIO_QUESTION || !FOLDER_IMAGE_QUESTION) {
            throw new NotfoundRequestError(
                `FOLDER_AUDIO_QUESTION_LOCAL or FOLDER_IMAGE_QUESTION_LOCAL not set!`
            );
        }

        if (data.length === 0) {
            throw new BadRequestError("Data is empty!");
        }

        const result = data.map((row) => {
            if (row.audio && !isUrl(row.audio)) {
                row.audioPath = `${FOLDER_AUDIO_QUESTION}/${row.audio}`;
            }

            if (row.image && !isUrl(row.image)) {
                row.imagePath = `${FOLDER_IMAGE_QUESTION}/${row.image}`;
            }

            const answers = [];

            if (row.tags) {
                row.tags = row.tags.split(";").map((t) => t.trim());
            }

            answerTexts.forEach((text, index) => {
                const option = `opt${text}`;

                if (row[option]) {
                    answers.push(
                        AnswerService.createAnswerTemp({
                            order: index + 1,
                            text: row[option],
                            isCorrect: AnswerService.hasCorrectAnswer(text, row.is_correct_cap),
                        })
                    );

                    delete row[option];
                }
            });

            return { ...row, answers };
        });

        return result;
    }

    static async handleUploadQuestionToCloud(data = []) {
        const promises = data.map(async (row) => {
            try {
                let uploadImageCloud, uploadAudioCloud;

                if (row.imagePath) {
                    const response = await cloudinary.upload({
                        file: row.imagePath,
                        publicId: filterExtFilePath(row.image),
                        folder: "toeic/question_image",
                    });

                    uploadImageCloud = cloudinary.getInfoUpload(response);

                    delete row.imagePath;
                }

                if (row.audioPath) {
                    const response = await cloudinary.upload({
                        file: row.audioPath,
                        publicId: filterExtFilePath(row.audio),
                        resource_type: "video",
                        folder: "toeic/audio_image",
                    });

                    uploadAudioCloud = cloudinary.getInfoUpload(response);

                    delete row.audioPath;
                }

                return { ...row, uploadImageCloud, uploadAudioCloud };
            } catch (error) {
                console.log(`error:::`, error);
                throw new Error(`Failed to upload question: ${error.message}`);
            }
        });

        const results = await Promise.all(promises);

        return results;
    }
}

module.exports = UploadServicer;
