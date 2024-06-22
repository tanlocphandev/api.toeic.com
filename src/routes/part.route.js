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
        validateFieldsInFile({ fields: ["partName"], keyBody: "parts" }),
    ],
    asyncHandler(partController.createMultipleWithUploadFile)
);
route.post(`/`, validateData(createPartSchema), asyncHandler(partController.create));
route.get(`/`, asyncHandler(partController.find));
route.patch(`/:partId`, validateData(createPartSchema), asyncHandler(partController.update));
route.get("/:partId", asyncHandler(partController.findById));

module.exports = route;
