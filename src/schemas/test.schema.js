const { z } = require("zod");

const createTestSchema = z.object({
    testName: z
        .string({ required_error: "Đây là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    testOfYear: z
        .string({ required_error: "Đây là trường bắt buộc" })
        .min(4, "Ít nhất 4 kí tự!")
        .max(4, "Nhiều nhất 4 kí tự!"),
    duration: z.number({ required_error: "Đây là trường bắt buộc" }),
});

module.exports = { createTestSchema };
