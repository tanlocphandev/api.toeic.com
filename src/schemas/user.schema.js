const { z } = require("zod");

const addTeacherSchema = z.object({
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
    gender: z.enum(["male", "female"], {
        required_error: "Giới tính là trường bắt buộc",
        message: "Giới tính phải là: male hoặc female",
    }),
    dob: z
        .string({
            required_error: "Ngày sinh là trường bắt buộc",
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không đúng định dạng, mong đợi YYYY-MM-DD"),
});

const updateProfileSchema = z.object({
    fullName: z
        .string({ required_error: "Họ và tên là trường bắt buộc" })
        .min(2, "Họ và tên ít nhất 2 kí tự!")
        .max(100, "Họ và tên nhiều nhất 100 kí tự!")
        .optional(),
    gender: z
        .enum(["male", "female"], {
            required_error: "Giới tính là trường bắt buộc",
            message: "Giới tính phải là: male hoặc female",
        })
        .optional(),
    dob: z
        .string({
            required_error: "Ngày sinh là trường bắt buộc",
        })
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh không đúng định dạng, mong đợi YYYY-MM-DD")
        .optional(),
    avatar: z.any().optional(),
});

const changeStatusSchema = z.object({
    userId: z.number({ required_error: "Mã người dùng là trường bắt buộc!" }),
    status: z.enum(["active", "inactive", "deleted"], {
        required_error: "Trạng thái là trường bắt buộc!",
        message: "Trạng thái phải là: active, inactive hoặc deleted",
    }),
});

module.exports = { addTeacherSchema, updateProfileSchema, changeStatusSchema };
