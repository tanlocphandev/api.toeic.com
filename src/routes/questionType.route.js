"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const questionTypeController = require("../controllers/questionType.controller");
const { createQuestionTypeSchema } = require("../schemas/questionType.schema");
const {
    validateData,
    validateExtFile,
    validateFileNotFound,
    validateFieldsInFile,
} = require("../middleware/validate.middleware");
const { uploadDisk } = require("../configs/multer.config");

route.post(
    `/multiple`,
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
        validateFieldsInFile({ fields: ["typeName"], keyBody: "types" }),
    ],
    asyncHandler(questionTypeController.createMultipleWithUploadFile)
);
route.post(
    `/`,
    validateData(createQuestionTypeSchema),
    asyncHandler(questionTypeController.create)
);
route.get(`/`, asyncHandler(questionTypeController.find));
route.patch(
    `/:typeId`,
    validateData(createQuestionTypeSchema),
    asyncHandler(questionTypeController.update)
);
route.get("/:typeId", asyncHandler(questionTypeController.findById));

module.exports = route;
