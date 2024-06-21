const { z } = require("zod");

const createTagSchema = z.object({
    tagName: z
        .string({ required_error: "Tên tag là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
});

module.exports = { createTagSchema };
