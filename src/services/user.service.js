"use strict";

const { USER_ROLES } = require("../constants");
const { ConflictRequestError, NotfoundRequestError } = require("../core/error.response");
const { userModel } = require("../models/user.model");
const { mapperUnSelect, generateRandomString, mapValue } = require("../utils");
const bcrypt = require("bcrypt");
const cloudinary = require("../libs/cloudinary.lib");

class UserService {
    static async find(query) {
        const { results, pagination } = await userModel.find(query);

        if (!results.length) return { results: [], pagination: pagination };

        return {
            results: results.map((row) =>
                mapperUnSelect(row, ["user_password", "user_salt", "user_verify"])
            ),
            pagination: pagination,
        };
    }

    static async addTeacher({ fullName, password, email, gender, dob }) {
        const userInsert = {
            user_fullName: fullName,
            user_password: password,
            user_email: email,
            user_sex: gender,
            user_dob: dob,
        };

        // Find if user exists
        const [foundUser, salt] = await Promise.all([
            userModel.findByEmail(email),
            bcrypt.genSalt(10),
        ]);

        if (foundUser) {
            throw new ConflictRequestError("Email đã tồn tại!", undefined, {
                email: "Email đã tồn tại",
            });
        }

        // Hash password
        userInsert["user_password"] = await bcrypt.hash(password, salt);
        userInsert["user_salt"] = salt;
        userInsert["user_role"] = USER_ROLES.TEACHER;

        // Generate id
        userInsert["user_id_prefix"] = generateRandomString(16);

        // Insert user
        const result = await userModel.insert(userInsert);

        // Return id
        return result?.insertId;
    }

    static async updateProfile(userId, body) {
        const foundUser = await userModel.findById(userId);

        if (!foundUser) {
            throw new NotfoundRequestError("Không tìm thấy tài khoản");
        }

        const payload = {};

        if (body.fullName) {
            payload["user_fullName"] = body.fullName;
        }

        if (body.dob) {
            payload["user_dob"] = body.dob;
        }

        if (body.gender) {
            payload["user_sex"] = body.gender;
        }

        if (body.avatar) {
            if (foundUser.user_avatar && foundUser.user_avatar?.public_id) {
                // Delete old avatar
                await cloudinary.destroy(foundUser.user_avatar?.public_id);
            }

            payload["user_avatar"] = mapValue({ rawValue: body.avatar, isJson: true });
        }

        const updated = await userModel.updateById(userId, payload);

        return updated.affectedRows;
    }

    static async changeStatus(userId, status) {
        const foundUser = await userModel.findById(userId);

        if (!foundUser) {
            throw new NotfoundRequestError("Không tìm thấy tài khoản");
        }

        const updated = await userModel.updateById(userId, { user_status: status });

        return updated.affectedRows;
    }
}

module.exports = UserService;
