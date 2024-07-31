"use strict";

const rbac = require("./role.middleware");
const asyncHandler = require("../helpers/asyncHandler.helper");
const { AuthFailureError } = require("../core/error.response");
const RbacService = require("../services/rbac.service");

/**
 * Grants access to a resource based on the user's role and the requested action.
 *
 * @param {string} action - The action to be performed on the resource (e.g., read, delete, update).
 * @param {*} resource - The resource to be accessed (e.g., profile, uploads, etc.).
 * @return {Promise<void>} - A Promise that resolves when access is granted, or rejects with an AuthFailureError if access is denied.
 * @throws {AuthFailureError} - If the user's role does not have permission to perform the requested action on the resource.
 */
const grantAccess = (action, resource) => {
    return asyncHandler(async (req, _, next) => {
        const { role } = req.user;
        const roleList = await RbacService.getListRole();

        rbac.setGrants(roleList);

        const permission = rbac.can(role)[action](resource);

        if (!permission.granted) {
            throw new AuthFailureError("Bạn không đủ quyền truy cập!");
        }

        next();
    });
};

module.exports = grantAccess;
