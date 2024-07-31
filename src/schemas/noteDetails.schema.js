const { z } = require("zod");

const createNoteDetailsSchema = z.object({
    note_id: z.number({ required_error: "Đây là trường bắt buộc" }),
    detail_title: z
        .string({ required_error: "Tiêu đề ghi chú là trường bắt buộc!" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    detail_content: z
        .string({ required_error: "Nội dung ghi chú là trường bắt buộc!" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
});

module.exports = { createNoteDetailsSchema };
