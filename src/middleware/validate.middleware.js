"use strict";

const { ZodError } = require("zod");
const { ServerError, BadRequestError, NotfoundRequestError } = require("../core/error.response");
const asyncHandler = require("../helpers/asyncHandler.helper");
const FileLib = require("../libs/file.lib");
const XLSX = require("../libs/xlsx.lib");

const validateData = (schema) => {
    return asyncHandler(async (req, _, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    key: issue.path.join("."),
                    message: issue.message,
                }));

                throw new BadRequestError("Invalid data", 400, errorMessages);
            } else {
                throw new ServerError(error.message);
            }
        }
    });
};

const validateExtFile = ({ extFile = [], message = "File not allowed" }) => {
    return asyncHandler(async (req, _, next) => {
        const { file } = req;

        console.log(`Check file validateExtFile [validate.middleware]:::`, file);

        const originalNames = file.originalname.split(".");
        const ext = originalNames[originalNames.length - 1];

        if (!extFile.includes(ext)) {
            // remove file from request
            FileLib.deleteFile(file.path);
            throw new BadRequestError(message);
        }

        next();
    });
};

const validateFileNotFound = (message = "File not found") => {
    return asyncHandler(async (req, _, next) => {
        const { file } = req;

        if (!file) throw new NotfoundRequestError(message);

        next();
    });
};

const validateFieldsInFile = ({ fields = [], keyBody = "body" }) => {
    if (!fields.length) return (req, _, next) => next();

    return asyncHandler(async (req, _, next) => {
        const { file } = req;

        const response = await XLSX.readAsync(file.path);

        if (!response.length) throw new NotfoundRequestError("Vui lòng không upload file rỗng!");

        const responseLength = response.length;

        for (let index = 0; index < responseLength; index++) {
            const row = response[index];

            console.log(`row check validateFieldsInFile [file validate.middleware]:::`, row);

            Object.keys(row).forEach((key) => {
                if (!fields.includes(key))
                    throw new BadRequestError(
                        `Chỉ cho phép các các cột ${fields.join(
                            ", "
                        )}!. Vui lòng upload đúng định dạng!`
                    );
            });
        }

        // set file to request body
        req.body[keyBody] = response;

        next();
    });
};

module.exports = {
    validateData,
    validateExtFile,
    validateFileNotFound,
    validateFieldsInFile,
};
