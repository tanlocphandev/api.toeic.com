"use strict";

const { mapperUnSelect, parseValueToJson } = require("../utils");
const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");
const { resourceModel } = require("./resource.model");

class GrantDao extends TimestampModel {
    constructor({ grant_id, grant_action, grant_attribute, resource_id, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.grant_id = grant_id;
        this.grant_action = grant_action;
        this.grant_attribute = grant_attribute;
        this.resource_id = resource_id;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                grant_id: 1,
                grant_action: 1,
                grant_attribute: 1,
                resource_id: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class GrantModel extends BaseModel {
    get tableName() {
        return "grants";
    }

    get idColumn() {
        return "grant_id";
    }

    async findById(grantId, include = false) {
        const response = await super.findOne({ grant_id: grantId });

        if (!response) return null;

        let result = new GrantDao(response);

        if (!include) return result;

        result = await this._findInclude(result);

        return result;
    }

    async _findInclude(data) {
        const resource = await resourceModel.findById(data.resource_id);
        return { ...data, resource: resource?.resource_name };
    }

    async findGrantByRoleId(roleId) {
        const response = await super.find({ role_id: roleId });

        if (!response) return [];

        let result = response.map((row) => new GrantDao(row));

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
                    grant_action: parseValueToJson({ value: t.grant_action }),
                    resource: resource?.resource_name,
                };
            })
        );

        return result;
    }
}

module.exports = { GrantDao, grantModel: new GrantModel() };
