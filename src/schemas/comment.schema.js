const { z } = require("zod");

const createCommentSchema = z.object({
    testId: z
        .number({ required_error: "Mã đề thi là trường bắt buộc!" })
        .positive("Mã đề thi phải lớn bằng 1!")
        .min(1, "Mã đề thi phải lớn bằng 1!"),
    content: z
        .string({ required_error: "Nội dung bình luận là trường bắt buộc!" })
        .max(255, "Nhiều nhất 255 kí tự!"),
    parentCommentId: z.number().nullable().optional(),
});

const updateCommentSchema = z.object({
    comment_content: z
        .string({ required_error: "Nội dung bình luận là trường bắt buộc!" })
        .max(255, "Nhiều nhất 255 kí tự!")
        .optional(),
});

const updateStatusCommentSchema = z.object({
    comment_status: z.enum(["active", "inactive"]).optional(),
});

const deleteCommentSchema = z.object({
    commentId: z
        .number({ required_error: "Mã bình luận là trường bắt buộc!" })
        .positive("Mã bình luận phải lớn bằng 1!")
        .min(1, "Mã bình luận phải lớn bằng 1!"),
    testId: z
        .number({ required_error: "Mã đề thi là trường bắt buộc!" })
        .positive("Mã đề thi phải lớn bằng 1!")
        .min(1, "Mã đề thi phải lớn bằng 1!"),
});

module.exports = {
    createCommentSchema,
    updateCommentSchema,
    deleteCommentSchema,
    updateStatusCommentSchema,
};
