"use strict";

const { ZodError } = require("zod");
const { ServerError, BadRequestError } = require("../core/error.response");
const asyncHandler = require("../helpers/asyncHandler.helper");

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

module.exports = validateData;
