"use strict";

const { mapperSelect, mapperUnSelect, parseValueToJson } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");
const { resourceModel } = require("./resource.model");

class RoleGrantDao extends TimestampModel {
    constructor({
        grant_id,
        grant_actions,
        grant_attribute,
        role_id,
        resource_id,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.grant_id = grant_id;
        this.grant_actions = grant_actions;
        this.grant_attribute = grant_attribute;
        this.role_id = role_id;
        this.resource_id = resource_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                grant_id: 1,
                grant_actions: 1,
                grant_attribute: 1,
                role_id: 1,
                resource_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class RoleGrantModel extends BaseModel {
    get tableName() {
        return "role_grants";
    }

    get idColumn() {
        return "grant_id";
    }

    async findById(grantId) {
        const response = await super.findOne({ grant_id: grantId });

        if (!response) return null;

        let result = new RoleGrantDao(response);

        return result;
    }

    async findGrantByRoleId(roleId) {
        const response = await super.find({ role_id: roleId });

        if (!response) return [];

        let result = response.map((row) => new RoleGrantDao(row));

        result = await Promise.all(
            result.map(async (t) => {
                const resource = await resourceModel.findById(t.resource_id);

                return {
                    ...mapperUnSelect(t, [
                        "created_at",
                        "updated_at",
                        "role_id",
                        "resource_id",
                        "grant_id",
                    ]),
                    grant_actions: parseValueToJson({ value: t.grant_actions }),
                    resource: resource?.resource_name,
                };
            })
        );

        return result;
    }
}

module.exports = { RoleGrantDao, roleGrantModel: new RoleGrantModel() };
