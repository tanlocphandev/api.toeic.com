"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const uploadController = require("../controllers/upload.controller");
const { uploadDisk } = require("../configs/multer.config");
const {
    validateExtFile,
    validateFileNotFound,
    validateData,
    validateFieldsInFile,
} = require("../middleware/validate.middleware");
const { uploadQuestionSchema } = require("../schemas/upload.schema");

route.post(
    "/local/xlsx",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
    ],
    asyncHandler(uploadController.uploadLocalFileXlsx)
);

route.post(
    "/local/question",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
    ],
    asyncHandler(uploadController.uploadQuestion)
);

route.post(
    "/local/audio",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["mp3", "wav", "flac", "mp4"],
            message: "File upload chỉ cho phép có đuôi .mp3, .wav, .flac, .mp4!",
        }),
    ],
    asyncHandler(uploadController.uploadAudio)
);

route.post(
    "/local/score",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
        validateFieldsInFile({
            fields: ["reading_score", "listening_score", "number_correct_answer"],
            keyBody: "scores",
        }),
    ],
    asyncHandler(uploadController.uploadScore)
);

module.exports = route;
