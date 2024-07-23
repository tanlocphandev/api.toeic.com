const { z } = require("zod");
const { EXAM_TYPES } = require("../constants");

const examSchemaCreate = z.object({
    testId: z.number({ required_error: "Mã đề thi là trường bắt buộc" }),
    userId: z.number({ required_error: "Mã người dùng là trường bắt buộc" }),
    questionTypeId: z.number().nullable().optional(),
    timer: z
        .number({ required_error: "Thời gian thi là trường bắt buộc" })
        .min(0, "Thời gian thi phải bằng 0")
        .max(9999, "Thời gian thi phải nhiều nhất 9999"),
    examType: z.enum([EXAM_TYPES.FULL_TEST, EXAM_TYPES.ONE_TEST], {
        required_error: "Loại đề thi là trường bắt buộc",
    }),
    answers: z.object({
        [z.string()]: z.number({ required_error: "Đây là trường bắt buộc" }).nullable().optional(),
    }),
});

module.exports = { examSchemaCreate };
