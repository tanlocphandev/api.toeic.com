"use strict";

const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class UserRoleDao extends TimestampModel {
    constructor({ user_id, role_id, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.user_id = user_id;
        this.role_id = role_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                user_id: 1,
                role_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class UserRoleModel extends BaseModel {
    get tableName() {
        return "users_roles";
    }

    get idColumn() {
        return "user_id";
    }
}

module.exports = { UserRoleDao, userRoleModel: new UserRoleModel() };
