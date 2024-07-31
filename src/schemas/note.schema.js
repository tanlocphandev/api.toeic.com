const { z } = require("zod");

const createNoteSchema = z.object({
    note_name: z
        .string({ required_error: "Tên mục ghi chú là trường bắt buộc!" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
});

module.exports = { createNoteSchema };
