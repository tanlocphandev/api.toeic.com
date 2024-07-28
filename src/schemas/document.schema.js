const { z } = require("zod");

const createDocSchema = z.object({
    doc_title: z
        .string({ required_error: "Tiêu đề là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    doc_desc: z
        .string({ required_error: "Mô tả là trường bắt buộc" })
        .min(2, "Ít nhất 2 kí tự!")
        .max(255, "Nhiều nhất 255 kí tự!"),
    doc_type: z.enum(["audio", "video", "text", "document"]),
    doc_audio: z.any(),
    doc_video: z.any(),
    doc_text: z.string().nullable(),
    doc_link: z.string().nullable(),
    doc_pdf: z.any(),
    doc_thumbnail: z.any(),
});

module.exports = { createDocSchema };
