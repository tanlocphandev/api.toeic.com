const { z } = require("zod");

const createQuestionTypeSchema = z.object({
    typeName: z
        .string({ required_error: "Tên loại câu hỏi là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
});

module.exports = { createQuestionTypeSchema };
