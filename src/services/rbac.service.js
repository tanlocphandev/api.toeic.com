"use strict";

const { ConflictRequestError } = require("../core/error.response");
const { resourceModel, ResourceDao } = require("../models/resource.model");
const { roleModel, RoleDao } = require("../models/role.model");
const { roleGrantModel } = require("../models/roleGrant.model");
const { userRoleModel } = require("../models/userRole.model");
const { generateRandomString, mapValue, mapperSelect, mapperUnSelect } = require("../utils");

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

    static async getAllResources() {
        const resources = await resourceModel.find();

        const result = resources.map((resource) => new ResourceDao(resource));

        return result.map((r) =>
            mapperSelect(r, ["resource_id", "resource_name", "resource_desc"])
        );
    }

    static async createRole({ name, slug, desc, grants = [] }) {
        /* 
            grants = [
                { 
                    resourceId: 'resource123', 
                    action: ['create:any', 'delete:any', ...], 
                    attributes: '*' | '* !column, !column2, ...' 
                },
                ...
            ]
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

        const payloadRoleGrants = grants.map((grant) => {
            const payload = {
                role_id: newRoleId,
                resource_id: grant.resourceId,
                grant_actions: mapValue({ rawValue: grant.action, isJson: true }),
                grant_attribute: grant.attributes,
            };

            return Object.values(payload);
        });

        await roleGrantModel.insertBulk({
            data: payloadRoleGrants,
            fields: ["role_id", "resource_id", "grant_actions", "grant_attribute"],
        });

        return newRoleId;
    }

    static async getListRole() {
        const roles = await roleModel.find();

        let result = roles.map((role) => new RoleDao(role));

        result = await Promise.all(
            result.map(async (row) => {
                const role_grants = await roleGrantModel.findGrantByRoleId(row.role_id);

                return {
                    ...mapperUnSelect(row, ["created_at", "updated_at"]),
                    role_grants,
                };
            })
        );

        const rolesMap = [];
        const resultLength = result.length;

        for (let i = 0; i < resultLength; i++) {
            const role = result[i];

            role.role_grants.forEach((grant) => {
                grant.grant_actions.forEach((action) => {
                    rolesMap.push({
                        role: role.role_name,
                        resource: grant.resource,
                        action: action,
                        attributes: grant.grant_attribute,
                    });
                });
            });
        }

        return rolesMap;
    }

    static async addGrantToRole() {}

    static async removeGrantToRole() {}

    static async updateGrant() {}
}

module.exports = RbacService;
