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
const { authentication } = require("../middleware/auth.middleware");
const { CREATE_ANY, UPDATE_ANY, READ_ANY } = require("../constants/rbac.constant");
const grantAccess = require("../middleware/rbac.middleware");

route.use(authentication);

route.get(`/`, asyncHandler(testController.find));
route.get(
    "/percent-join-exam-test",
    grantAccess(READ_ANY, "test"),
    asyncHandler(testController.percentJoinExamTest)
);

route.get("/with/years", asyncHandler(testController.getTestWithYears));
route.get("/:testId", asyncHandler(testController.findById));

// For teacher role

route.patch(
    `/:testId`,
    grantAccess(UPDATE_ANY, "test"),
    validateData(createTestSchema),
    asyncHandler(testController.update)
);
route.post(
    `/multiple`,
    [
        grantAccess(CREATE_ANY, "test"),
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
route.post(
    `/with-questions`,
    grantAccess(CREATE_ANY, "test"),
    asyncHandler(testController.createWithUploadQuestion)
);
route.post(
    `/`,
    grantAccess(CREATE_ANY, "test"),
    validateData(createTestSchema),
    asyncHandler(testController.create)
);

module.exports = route;
