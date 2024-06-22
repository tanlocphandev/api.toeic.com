"use strict";

const multer = require("multer");
const fs = require("fs");
const APP_CONFIGS = require("./app.config");

const uploadDisk = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const path = `./src/${APP_CONFIGS.UPLOAD_DIR}/`;

            if (fs.existsSync(path) === false) {
                fs.mkdirSync(path, { recursive: true });
            }

            cb(null, path);
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const originalNames = file.originalname.split(".");

            const filename = originalNames[0];
            const ext = originalNames[1];
            const fileName = `${filename}-${uniqueSuffix}.${ext}`;

            cb(null, fileName);
        },
    }),
});

module.exports = {
    uploadDisk,
};
