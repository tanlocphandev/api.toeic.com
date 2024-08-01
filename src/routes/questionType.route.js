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
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { CREATE_ANY, UPDATE_ANY, DELETE_ANY } = require("../constants/rbac.constant");

route.get(`/`, asyncHandler(questionTypeController.find));
route.get("/:typeId", asyncHandler(questionTypeController.findById));
route.get("/slug/:slug", asyncHandler(questionTypeController.findBySlug));

route.use(authentication);
// for teacher role

route.post(
    `/multiple`,
    [
        grantAccess(CREATE_ANY, "questionType"),
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
    grantAccess(CREATE_ANY, "questionType"),
    validateData(createQuestionTypeSchema),
    asyncHandler(questionTypeController.create)
);

route.patch(
    `/:typeId`,
    grantAccess(UPDATE_ANY, "questionType"),
    validateData(createQuestionTypeSchema),
    asyncHandler(questionTypeController.update)
);

route.delete(
    `/:typeId`,
    grantAccess(DELETE_ANY, "questionType"),
    asyncHandler(questionTypeController.deleteById)
);

module.exports = route;
