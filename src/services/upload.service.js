"use strict";

const APP_CONFIGS = require("../configs/app.config");
const { BadRequestError, NotfoundRequestError } = require("../core/error.response");
const cloudinary = require("../libs/cloudinary.lib");
const { isUrl, filterExtFilePath, randomNumber } = require("../utils");
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

        let group_question_order = -1;
        let result = [];

        data.forEach((row) => {
            row = UploadServicer.mapperMediaPathQuestion(row);

            let answers = [],
                isPushResult = true;

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

            if (row.group_question_order) {
                if (row.group_question_order !== group_question_order) {
                    group_question_order = row.group_question_order;
                }

                // Find group question order exist in result;

                const index = result.findIndex(
                    (t) => t?.group_question_order === group_question_order
                );

                if (index === -1) {
                    const group_question = {
                        group_id: randomNumber(),
                        audio: row?.group_audio,
                        image: row?.group_image,
                        text: row?.group_text,
                        group_question_order: group_question_order,
                        group_transcript: row?.group_transcript,
                        part: row?.part,
                    };

                    delete row?.group_audio;
                    delete row?.group_image;
                    delete row?.group_text;
                    delete row?.group_transcript;

                    row = UploadServicer.mapperMediaPathQuestion({
                        ...group_question,
                        group_questions: [{ ...row, answers }],
                    });

                    answers = [];
                } else {
                    const item = result[index];

                    isPushResult = false;

                    result[index] = {
                        ...item,
                        group_questions: [...item.group_questions, { ...row, answers }],
                    };
                }
            }

            isPushResult && result.push({ ...row, answers });
        });

        return result;
    }

    static async handleUploadQuestionToCloud(data = []) {
        const promises = data.map(async (row) => {
            try {
                let uploadImageCloud, uploadAudioCloud;

                if (row.imagePath) {
                    uploadImageCloud = await UploadServicer.handleUpload({
                        file: row.imagePath,
                        publicId: filterExtFilePath(row.image), // toeic/2020/test1/question_audio/1.[png, webp, jpg, ... (image/*)]
                        folder: "toeic/question_image", // toeic/year/test/question_image -> toeic/2020/test1/question_image
                    });

                    delete row.imagePath;
                }

                if (row.audioPath) {
                    uploadAudioCloud = await UploadServicer.handleUpload({
                        file: row.audioPath,
                        publicId: filterExtFilePath(row.audio), // toeic/2020/test1/question_audio/1.mp3
                        resource_type: "video",
                        folder: "toeic/audio_image", // toeic/year/test/question_audio -> toeic/2020/test1/question_audio
                    });

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

    static async handleUpload({ file, publicId, resource_type, folder }) {
        const options = {
            file,
            publicId,
            resource_type,
            folder,
        };

        const response = await cloudinary.upload(options);

        return cloudinary.getInfoUpload(response);
    }

    static mapperMediaPathQuestion = (row) => {
        if (row?.audio && !isUrl(row.audio)) {
            row.audioPath = `${FOLDER_AUDIO_QUESTION}/${row.audio}`;
        }

        if (row?.image && !isUrl(row.image)) {
            row.imagePath = `${FOLDER_IMAGE_QUESTION}/${row.image}`;
        }

        return row;
    };
}

module.exports = UploadServicer;
