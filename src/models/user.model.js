"use strict";

const BaseModel = require("./base.model");

class UserModel extends BaseModel {
    constructor({
        user_id,
        user_id_prefix,
        user_name,
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
        super();
        this.user_id = user_id;
        this.user_id_prefix = user_id_prefix;
        this.user_name = user_name;
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

    query() {
        return {
            user_id: this.user_id,
            user_id_prefix: this.user_id_prefix,
            user_name: this.user_name,
            user_password: this.user_password,
            user_salt: this.user_salt,
            user_email: this.user_email,
            user_sex: this.user_sex,
            user_avatar: this.user_avatar,
            user_role: this.user_role,
            user_dob: this.user_dob,
            user_status: this.user_status,
            user_verify: this.user_verify,
            created_at: this.created_at,
            updated_at: this.updated_at,
        };
    }

    create() {
        return this.query();
        // return super.insert(this);
    }

    get tableName() {
        return "users";
    }

    static get idColumn() {
        return "username";
    }
}

module.exports = UserModel;
