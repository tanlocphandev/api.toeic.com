"use strict";

const BaseModel = require("./base.model");

class RoleGrantDao {
    constructor({ grant_id, role_id }) {
        this.grant_id = grant_id;
        this.role_id = role_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                grant_id: 1,
                role_id: 1,
            });
        }

        return this.instance;
    }
}

class RoleGrantModel extends BaseModel {
    get tableName() {
        return "roles_grants";
    }

    get idColumn() {
        return "grant_id";
    }
}

module.exports = { RoleGrantDao, roleGrantModel: new RoleGrantModel() };
