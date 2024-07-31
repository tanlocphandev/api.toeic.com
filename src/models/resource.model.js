"use strict";

const BaseModel = require("./base.model");
const TimestampModel = require("./common/timestamp.model");

class ResourceDao extends TimestampModel {
    constructor({ resource_id, resource_name, resource_desc, created_at, updated_at }) {
        super({ created_at, updated_at });

        this.resource_id = resource_id;
        this.resource_name = resource_name;
        this.resource_desc = resource_desc;
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this({
                resource_id: 1,
                resource_name: 1,
                resource_desc: 1,
                created_at: 1,
                updated_at: 1,
            });
        }

        return this.instance;
    }
}

class ResourceModel extends BaseModel {
    get tableName() {
        return "resources";
    }

    get idColumn() {
        return "resource_id";
    }

    async findByName(name) {
        const response = await super.findOne({ resource_name: name });

        if (!response) return null;

        return new ResourceDao(response);
    }

    async findById(resourceId) {
        const response = await super.findOne({ resource_id: resourceId });

        if (!response) return null;

        let result = new ResourceDao(response);

        return result;
    }
}

module.exports = { ResourceDao, resourceModel: new ResourceModel() };
