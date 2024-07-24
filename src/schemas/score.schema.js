const { z } = require("zod");

const createScoreSchema = z.object({
    scoreName: z
        .string({ required_error: "Tên bảng điểm là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
});

module.exports = { createScoreSchema };
