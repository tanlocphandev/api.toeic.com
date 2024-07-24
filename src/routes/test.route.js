"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const testController = require("../controllers/test.controller");
const { createTestSchema } = require("../schemas/test.schema");
const {
    validateData,
    validateExtFile,
    validateFileNotFound,
    validateFieldsInFile,
} = require("../middleware/validate.middleware");
const { uploadDisk } = require("../configs/multer.config");
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { USER_ROLES } = require("../constants");

route.use(authentication);

route.get(`/`, asyncHandler(testController.find));
route.get("/with/years", asyncHandler(testController.getTestWithYears));
route.get("/:testId", asyncHandler(testController.findById));

route.use(checkRoles([USER_ROLES.ADMIN]));

route.patch(`/:testId`, validateData(createTestSchema), asyncHandler(testController.update));
route.post(
    `/multiple`,
    [
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
        validateFieldsInFile({ fields: ["tagName"], keyBody: "tags" }),
    ],
    asyncHandler(testController.createMultipleWithUploadFile)
);
route.post(`/with-questions`, asyncHandler(testController.createWithUploadQuestion));
route.post(`/`, validateData(createTestSchema), asyncHandler(testController.create));

module.exports = route;
