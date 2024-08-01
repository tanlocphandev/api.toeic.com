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
    grantIds: z
        .array(z.number({ required_error: "GrantId là trường bắt buộc" }))
        .nonempty({ message: "Grant không được rỗng" }),
});

// resourceId, action, attribute
const createGrantSchema = z.object({
    resourceId: z
        .number({ required_error: "resourceId là trường bắt buộc" })
        .positive("resourceId phải lớn bằng 1!")
        .min(1, "resourceId phải lớn bằng 1!"),
    action: z.enum(
        [
            "create:any",
            "read:any",
            "update:any",
            "delete:any",
            "create:own",
            "read:own",
            "update:own",
            "delete:own",
        ],
        {
            required_error: "action là trường bắt buộc",
            message:
                "action phải chọn trong: create:any, read:any, update:any, delete:any, create:own, read:own, update:own, delete:own!",
        }
    ),
    attribute: z
        .string({ required_error: "attribute là trường bắt buộc" })
        .max(255, "Nhiều nhất 255 kí tự!"),
});

const modifyGrantRoleSchema = z.object({
    grant_id: z
        .number({ required_error: "grant_id là trường bắt buộc" })
        .positive("grant_id phải lớn bằng 1!")
        .min(1, "grant_id phải lớn bằng 1!"),
    role_id: z
        .number({ required_error: "role_id là trường bắt buộc" })
        .positive("role_id phải lớn bằng 1!")
        .min(1, "role_id phải lớn bằng 1!"),
});

// resourceId, action, attribute
const updateGrantSchema = z.object({
    action: z
        .enum(
            [
                "create:any",
                "read:any",
                "update:any",
                "delete:any",
                "create:own",
                "read:own",
                "update:own",
                "delete:own",
            ],
            {
                required_error: "action là trường bắt buộc",
                message:
                    "action phải chọn trong: create:any, read:any, update:any, delete:any, create:own, read:own, update:own, delete:own!",
            }
        )
        .optional(),
});

module.exports = {
    createResourceSchema,
    createGrantSchema,
    createRoleSchema,
    modifyGrantRoleSchema,
    updateGrantSchema,
};
