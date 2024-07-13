const { z } = require("zod");

const uploadQuestionSchema = z.object({
    testOfYear: z.string({ required_error: "Đây là trường bắt buộc" }),
    testNoOfYear: z.string({ required_error: "Đây là trường bắt buộc" }),
});

module.exports = { uploadQuestionSchema };
