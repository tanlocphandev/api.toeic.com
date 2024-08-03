"use strict";

const { Created, OK } = require("../core/success.response");
const RoleService = require("../services/role.service");

class RoleController {
    getRoles = async (req, res) => {
        new OK({
            message: "Get roles success",
            metadata: await RoleService.getRoles(),
        }).send(res);
    };

    viewRolesById = async (req, res) => {
        new OK({
            message: "Get view roles success",
            metadata: await RoleService.viewRolesById(
                req.params.roleId,
                req.query.isSelectNotInRoleId === "true"
            ),
        }).send(res);
    };
}

module.exports = new RoleController();
