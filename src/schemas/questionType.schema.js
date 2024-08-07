const { z } = require("zod");

const createQuestionTypeSchema = z.object({
    typeName: z
        .string({ required_error: "Tên loại câu hỏi là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    partId: z.string({ required_error: "Phần là trường bắt buộc" }).optional().nullable(),
    description: z.string().max(255, "Nhiều nhất 255 kí tự!").optional().nullable(),
    thumb: z.any().optional().nullable(),
});

module.exports = { createQuestionTypeSchema };
