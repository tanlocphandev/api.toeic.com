"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const uploadController = require("../controllers/upload.controller");
const { uploadDisk } = require("../configs/multer.config");
const { validateExtFile, validateFileNotFound } = require("../middleware/validate.middleware");

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

module.exports = route;
