"use strict";

const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");
const { USER_ROLES } = require("../constants");
const QueryHelper = require("../helpers/query.helper");
const _ = require("lodash");
const { filterPropOutsideInstance } = require("../utils");

class UserDao extends TimestampModel {
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
        super({ created_at, updated_at });

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
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                user_id: 1,
                user_id_prefix: 1,
                user_fullName: 1,
                user_password: 1,
                user_salt: 1,
                user_email: 1,
                user_sex: 1,
                user_avatar: 1,
                user_role: 1,
                user_dob: 1,
                user_status: 1,
                user_verify: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
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
        const response = await super.findOne({ user_email: email });

        if (!response) return null;

        return new UserDao(response);
    }

    async findById(userId) {
        const response = await super.findOne({ user_id: userId });

        if (!response) return null;

        return new UserDao(response);
    }

    async checkExistRoleAdmin() {
        const response = await super.findOne({ user_role: USER_ROLES.ADMIN });

        if (!response) return null;

        return new UserDao(response);
    }

    async find(filters) {
        const { limit, page, offset, query, order } = QueryHelper.getPagination(filters);

        // Check if exist query in request or not if exist in instance remove it
        const where = filterPropOutsideInstance({ instance: UserDao, fields: query });

        const { totalPage, totalRow, data } = await super.findAndCountAll({
            where,
            limit,
            offset,
            order,
        });

        if (!data.length) return { results: [], pagination: { totalPage, totalRow, page, limit } };

        const results = data.map((row) => new UserDao(row));

        return { results: results, pagination: { totalPage, totalRow, page, limit } };
    }
}

const userModel = new UserModel();

module.exports = { userModel, UserDao };
