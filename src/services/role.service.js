"use strict";

const { roleModel } = require("../models/role.model");
const { roleGrantModel } = require("../models/roleGrant.model");
const { NotfoundRequestError } = require("../core/error.response");

class RoleService {
    static async getRoles() {
        const roles = await roleModel.find();
        return roles;
    }

    static async viewRolesById(roleId, isSelectNotInRoleId = false) {
        // Check if the role exists
        const role = await roleModel.findById(roleId);

        // console.log("====================================");
        // console.log(`isSelectNotInRoleId:::`, isSelectNotInRoleId);
        // console.log("====================================");

        if (!role) {
            throw new NotfoundRequestError("Không tìm thấy vai trò");
        }

        // Get all grants
        const grants = await roleGrantModel.findByRoleId(roleId, isSelectNotInRoleId);

        return {
            role,
            grants,
        };
    }
}

module.exports = RoleService;
