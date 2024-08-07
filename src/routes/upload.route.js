"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const uploadController = require("../controllers/upload.controller");
const { uploadDisk } = require("../configs/multer.config");
const {
    validateExtFile,
    validateFileNotFound,
    validateFieldsInFile,
    validateLimitSize,
} = require("../middleware/validate.middleware");

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
    "/local/video",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["mp4", "avi", "MTS", "M2TS", "TS", "mov", "qt", "wmv"],
            message: `File upload chỉ cho phép có đuôi "mp4", "avi", "MTS", "M2TS", "TS", "mov", "qt", "wmv"!`,
        }),
    ],
    asyncHandler(uploadController.uploadVideo)
);

route.post(
    "/local/image",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["jpg", "jpeg", "png", "webp", "jfif", "JPG", "JPEG", "PNG"],
            message: `File upload chỉ cho phép có đuôi "jpg", "jpeg", "png", "webp", "jfif", "JPG", "JPEG", "PNG" !`,
        }),
    ],
    asyncHandler(uploadController.uploadImage)
);

route.post(
    "/local/pdf",
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["pdf"],
            message: "File upload chỉ cho phép có đuôi .pdf!",
        }),
        validateLimitSize(10),
    ],
    asyncHandler(uploadController.uploadPdf)
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
