"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const partController = require("../controllers/part.controller");
const { createPartSchema } = require("../schemas/part.schema");
const {
    validateData,
    validateExtFile,
    validateFileNotFound,
    validateFieldsInFile,
} = require("../middleware/validate.middleware");
const { authentication, checkRoles } = require("../middleware/auth.middleware");
const { uploadDisk } = require("../configs/multer.config");
const { USER_ROLES } = require("../constants");

route.get(`/`, asyncHandler(partController.find));
route.get("/:partId", asyncHandler(partController.findById));

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
        validateFieldsInFile({ fields: ["partName", "partNumber"], keyBody: "parts" }),
    ],
    asyncHandler(partController.createMultipleWithUploadFile)
);
route.post(`/`, validateData(createPartSchema), asyncHandler(partController.create));
route.patch(`/:partId`, validateData(createPartSchema), asyncHandler(partController.update));

module.exports = route;
