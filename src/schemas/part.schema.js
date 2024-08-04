const { z } = require("zod");

const createPartSchema = z.object({
    partName: z
        .string({ required_error: "Tên part là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    partNumber: z.number({ required_error: "Số part là trường bắt buộc" }),
    description: z.string().max(255, "Nhiều nhất 255 kí tự!").optional().nullable(),
});

module.exports = { createPartSchema };
