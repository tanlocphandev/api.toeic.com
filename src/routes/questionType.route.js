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
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants");

route.get(`/`, asyncHandler(questionTypeController.find));
route.get("/:typeId", asyncHandler(questionTypeController.findById));

route.use(authentication);
route.use(checkRoles([USER_ROLES.ADMIN]));

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

route.patch(
    `/:typeId`,
    validateData(createQuestionTypeSchema),
    asyncHandler(questionTypeController.update)
);

module.exports = route;
