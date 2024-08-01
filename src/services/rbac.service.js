"use strict";

const { ConflictRequestError } = require("../core/error.response");
const { resourceModel, ResourceDao } = require("../models/resource.model");
const { roleModel } = require("../models/role.model");
const { roleGrantModel, RoleGrantDao } = require("../models/roleGrant.model");
const { grantModel } = require("../models/grant.model");
const { mapperSelect, mapperUnSelect } = require("../utils");

class RbacService {
    static async createResource({ name, desc }) {
        const foundResource = await resourceModel.findByName(name);
        if (foundResource) throw new ConflictRequestError("Resource đã tồn tại");

        const payload = {
            resource_name: name,
            resource_desc: desc,
        };

        const added = await resourceModel.insert(payload);

        return added.insertId;
    }

    static async createGrant({ resourceId, action, attribute }) {
        const foundGrant = await grantModel.findOne({
            resource_id: resourceId,
            grant_action: action,
            grant_attribute: attribute,
        });

        if (foundGrant) throw new ConflictRequestError("Grant đã tồn tại");

        const payload = {
            resource_id: resourceId,
            grant_action: action,
            grant_attribute: attribute,
        };

        const added = await grantModel.insert(payload);

        return added.insertId;
    }

    static async updateGrant(grantId, { action }) {
        if (!action) return 0;

        const payload = {
            grant_action: action,
        };

        const updated = await grantModel.updateOne({ grant_id: grantId }, payload);

        return updated.affectedRows;
    }

    static async createGrantMultiple({ grants = [] }) {
        // check if grant already exists

        const foundGrants = await Promise.all(
            grants.map(
                async (g) =>
                    await grantModel.findOne({
                        resource_id: g.resourceId,
                        grant_action: g.action,
                        grant_attribute: g.attribute,
                    })
            )
        );

        if (foundGrants.filter((g) => g).length) {
            throw new ConflictRequestError("Grant đã tồn tại", undefined, foundGrants);
        }

        const payload = grants.map((g) => {
            const payload = {
                resource_id: g.resourceId,
                grant_action: g.action,
                grant_attribute: g.attribute,
            };

            return Object.values(payload);
        });

        const added = await grantModel.insertBulk({
            data: payload,
            fields: ["resource_id", "grant_action", "grant_attribute"],
        });

        return added;
    }

    static async getAllGrants() {
        const grants = await grantModel.find();

        if (!grants.length) return [];

        const result = await Promise.all(
            grants.map(async (t) => {
                const resource = await resourceModel.findById(t.resource_id);
                return { ...t, resource: resource?.resource_name };
            })
        );

        return result.map((t) => mapperUnSelect(t, ["created_at", "updated_at"]));
    }

    static async getAllResources() {
        const resources = await resourceModel.find();

        const result = resources.map((resource) => new ResourceDao(resource));

        return result.map((r) =>
            mapperSelect(r, ["resource_id", "resource_name", "resource_desc"])
        );
    }

    static async createRole({ name, slug, desc, grantIds = [] }) {
        /* 
            grantIds = [1, 2, 3, 4...]
        */

        const foundRole = await roleModel.findOne({
            role_slug: slug,
            role_name: name,
        });

        if (foundRole) throw new ConflictRequestError("Role đã tồn tại");

        const payloadNewRole = {
            role_name: name, // user | admin | teacher
            role_desc: desc,
            role_slug: slug, // unique every role
        };

        const newRole = await roleModel.insert(payloadNewRole);

        const newRoleId = newRole.insertId;

        const payloadRoleGrants = grantIds.map((grantId) => {
            const payload = {
                role_id: newRoleId,
                grant_id: grantId,
            };

            return Object.values(payload);
        });

        await roleGrantModel.insertBulk({
            data: payloadRoleGrants,
            fields: ["role_id", "grant_id"],
        });

        return newRoleId;
    }

    static async getListRole(payload = { role: "", includeId: false }) {
        const { role = "", includeId = false } = payload;

        const rolesGrants = await roleGrantModel.find();

        let result = rolesGrants.map((role) => new RoleGrantDao(role));

        result = await Promise.all(
            result.map(async (row) => {
                const role = await roleModel.findById(row.role_id);
                const grant = await grantModel.findById(row.grant_id, true);

                if (includeId) {
                    return {
                        role_id: row.role_id,
                        grant_id: row.grant_id,
                        role: role.role_name,
                        resource: grant.resource,
                        action: grant.grant_action,
                        attribute: grant.grant_attribute,
                    };
                }

                return {
                    role: role.role_name,
                    resource: grant.resource,
                    action: grant.grant_action,
                    attribute: grant.grant_attribute,
                };
            })
        );

        if (role) result = result.filter((r) => r.role === role);

        return result;
    }

    static async addGrantToRole({ role_id = 0, grant_id = 0 }) {
        const found = await roleGrantModel.findOne({
            role_id,
            grant_id,
        });

        if (found) throw new ConflictRequestError("Grant đã tồn tại");

        const payload = {
            role_id,
            grant_id,
        };

        await roleGrantModel.insert(payload);

        return true;
    }

    static async removeGrantToRole({ role_id = 0, grant_id = 0 }) {
        const found = await roleGrantModel.findOne({
            role_id,
            grant_id,
        });

        if (!found) throw new ConflictRequestError("Grant đã tồn tại");

        await roleGrantModel.deleteOne({
            role_id,
            grant_id,
        });

        return true;
    }
}

module.exports = RbacService;
