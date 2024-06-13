const { z } = require("zod");

const registerSchema = z.object({
    fullName: z
        .string({ required_error: "Họ và tên là trường bắt buộc" })
        .min(2, "Họ và tên ít nhất 2 kí tự!")
        .max(100, "Họ và tên nhiều nhất 100 kí tự!"),
    email: z
        .string({ required_error: "Địa chỉ email là trường bắt buộc" })
        .email("Địa chỉ email không hợp lệ!")
        .max(100, "Địa chỉ email nhiều nhất 100 kí tự!"),
    password: z
        .string({ required_error: "Mật này là trường bắt buộc" })
        .min(4, "Mật này ít nhất 4 kí tự!")
        .max(50, "Mật này nhiều nhất 50 kí tự!"),
});

const loginSchema = z.object({
    email: z
        .string({ required_error: "Địa chỉ email là trường bắt buộc" })
        .email("Địa chỉ email không hợp lệ!")
        .max(100, "Địa chỉ email nhiều nhất 100 kí tự!"),
    password: z
        .string({ required_error: "Mật này là trường bắt buộc" })
        .min(4, "Mật này ít nhất 4 kí tự!")
        .max(50, "Mật này nhiều nhất 50 kí tự!"),
});

module.exports = { registerSchema, loginSchema };
