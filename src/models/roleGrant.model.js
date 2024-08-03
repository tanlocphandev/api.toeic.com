"use strict";

const BaseModel = require("./base.model");
const { grantModel } = require("./grant.model");

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

    async _findIncludeGrant(data = []) {
        const grants = await Promise.all(
            data.map(async (row) => {
                const grant = await grantModel.findById(row.grant_id, true);
                return { ...row, grant };
            })
        );

        return grants;
    }

    async findByRoleId(roleId, isSelectNotInRoleId = false) {
        const response = await super.callProcedure({
            procedureName: "prod_get_role_grants",
            params: [+roleId, Boolean(isSelectNotInRoleId) ? 1 : 0],
        });

        return response;
    }
}

module.exports = { RoleGrantDao, roleGrantModel: new RoleGrantModel() };
