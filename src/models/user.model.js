"use strict";

const BaseModel = require("./base.model");
const { USER_ROLES } = require("../constants");

class UserDao {
    constructor({
        user_id,
        user_id_prefix,
        user_fullName,
        user_password,
        user_salt,
        user_email,
        user_sex,
        user_avatar,
        user_role,
        user_dob,
        user_status,
        user_verify,
        created_at,
        updated_at,
    }) {
        this.user_id = user_id;
        this.user_id_prefix = user_id_prefix;
        this.user_fullName = user_fullName;
        this.user_password = user_password;
        this.user_salt = user_salt;
        this.user_email = user_email;
        this.user_sex = user_sex;
        this.user_avatar = user_avatar;
        this.user_role = user_role;
        this.user_dob = user_dob;
        this.user_status = user_status;
        this.user_verify = user_verify;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

class UserModel extends BaseModel {
    get tableName() {
        return "users";
    }

    get idColumn() {
        return "user_id";
    }

    async findByEmail(email) {
        const response = await this.findOne({ user_email: email });

        if (!response) return null;

        return new UserDao(response);
    }

    async findById(userId) {
        const response = await this.findOne({ user_id: userId });

        if (!response) return null;

        return new UserDao(response);
    }

    async checkExistRoleAdmin() {
        const response = await this.findOne({ user_role: USER_ROLES.ADMIN });

        if (!response) return null;

        return new UserDao(response);
    }

    async find() {
        const response = await super.find();

        if (!response.length) return [];

        return response.map((row) => new UserDao(row));
    }
}

const userModel = new UserModel();

module.exports = { userModel, UserDao };
