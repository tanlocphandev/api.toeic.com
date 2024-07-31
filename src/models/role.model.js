"use strict";

const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class RoleDao extends TimestampModel {
    constructor({ role_id, role_name, role_slug, role_desc, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.role_id = role_id;
        this.role_name = role_name;
        this.role_slug = role_slug;
        this.role_desc = role_desc;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                role_id: 1,
                role_name: 1,
                role_slug: 1,
                role_desc: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class RoleModel extends BaseModel {
    get tableName() {
        return "roles";
    }

    get idColumn() {
        return "role_id";
    }

    async findById(roleId) {
        const response = await super.findOne({ role_id: roleId });

        if (!response) return null;

        let result = new RoleDao(response);

        return result;
    }
}

module.exports = { RoleDao, roleModel: new RoleModel() };
