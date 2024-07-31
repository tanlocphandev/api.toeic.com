const { z } = require("zod");

const createResourceSchema = z.object({
    name: z
        .string({ required_error: "Tên resource là trường bắt buộc" })
        .max(255, "Nhiều nhất 255 kí tự!"),
    desc: z.string().max(255, "Nhiều nhất 255 kí tự!").nullable().optional(),
});

const createRoleSchema = z.object({
    name: z.enum(["admin", "user", "teacher"], {
        required_error: "Tên quyền là trường bắt buộc",
        message: "Tên quyền không hợp lệ!. Gồm những quyền: admin, user, teacher",
    }),
    desc: z.string().max(255, "Nhiều nhất 255 kí tự!").nullable().optional(),
    slug: z.string({ required_error: "Slug là trường bắt buộc" }).max(255, "Nhiều nhất 255 kí tự!"),
    grants: z
        .array(
            z.object({
                resourceId: z
                    .number()
                    .positive("ResourceId phải lớn bằng 1")
                    .min(1, "ResourceId phải lớn bằng 1"),
                action: z.array(z.string().max(255, "Nhiều nhất 255 kí tự!"), {
                    required_error: "Action là trường bắt buộc",
                }),
                attributes: z
                    .string({ required_error: "Attributes là trường bắt buộc" })
                    .max(255, "Nhiều nhất 255 kí tự!"),
            }),
            {
                required_error: "Grant là trường bắt buộc",
                message: "Grant phải là một array",
            }
        )
        .nonempty({ message: "Grant không được rỗng" }),
});

module.exports = { createResourceSchema, createRoleSchema };
