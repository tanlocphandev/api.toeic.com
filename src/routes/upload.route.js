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

module.exports = route;
