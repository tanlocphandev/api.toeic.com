"use strict";

const express = require("express");
const route = express.Router();
const asyncHandler = require("../helpers/asyncHandler.helper");
const rbacController = require("../controllers/rbac.controller");
const {
    createResourceSchema,
    createRoleSchema,
    createGrantSchema,
    modifyGrantRoleSchema,
    updateGrantSchema,
} = require("../schemas/rbac.schema");
const {
    validateData,
    validateFileNotFound,
    validateExtFile,
    validateFieldsInFile,
} = require("../middleware/validate.middleware");
const { uploadDisk } = require("../configs/multer.config");
const { authentication } = require("../middleware/auth.middleware");
const grantAccess = require("../middleware/rbac.middleware");
const { CREATE_OWN, READ_OWN, DELETE_OWN, UPDATE_OWN } = require("../constants/rbac.constant");

route.use(authentication);
// For admin role

route.post(
    `/grant`,
    [grantAccess(CREATE_OWN, "rbac"), validateData(createGrantSchema)],
    asyncHandler(rbacController.createGrant)
);

route.post(
    `/grant/multiple`,
    [
        grantAccess(CREATE_OWN, "rbac"),
        uploadDisk.single("file"),
        validateFileNotFound(`Không tìm thấy file excel upload!`),
        validateExtFile({
            extFile: ["xlsx", "csv"],
            message: "File upload chỉ cho phép có đuôi .xlsx, .csv!",
        }),
        validateFieldsInFile({
            fields: ["resourceId", "action", "attribute"],
            keyBody: "grants",
        }),
    ],
    asyncHandler(rbacController.createGrantMultiple)
);

route.post(
    `/resource`,
    [grantAccess(CREATE_OWN, "rbac"), validateData(createResourceSchema)],
    asyncHandler(rbacController.creteResource)
);

route.post(
    `/role`,
    [grantAccess(CREATE_OWN, "rbac"), validateData(createRoleSchema)],
    asyncHandler(rbacController.creteRole)
);

route.post(
    "/grant-role",
    [grantAccess(CREATE_OWN, "rbac"), validateData(modifyGrantRoleSchema)],
    asyncHandler(rbacController.addGrantToRole)
);

route.delete(
    "/grant-role",
    [grantAccess(DELETE_OWN, "rbac"), validateData(modifyGrantRoleSchema)],
    asyncHandler(rbacController.removeGrantToRole)
);

route.patch(
    "/grant/:grantId",
    [grantAccess(UPDATE_OWN, "rbac"), validateData(updateGrantSchema)],
    asyncHandler(rbacController.updateGrant)
);

route.get("/resources", grantAccess(READ_OWN, "rbac"), asyncHandler(rbacController.getAllResource));
route.get(`/roles`, grantAccess(READ_OWN, "rbac"), asyncHandler(rbacController.getListRole));
route.get(`/grants`, grantAccess(READ_OWN, "rbac"), asyncHandler(rbacController.getListGrant));

module.exports = route;
