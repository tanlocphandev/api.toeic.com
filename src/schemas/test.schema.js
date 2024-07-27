const { z } = require("zod");

const createTestSchema = z.object({
    testName: z
        .string({ required_error: "Đây là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    testNoOfYear: z.number({ required_error: "Đây là trường bắt buộc" }),
    testOfYear: z.any({ required_error: "Đây là trường bắt buộc" }),
    duration: z.number({ required_error: "Đây là trường bắt buộc" }),
});

module.exports = { createTestSchema };
