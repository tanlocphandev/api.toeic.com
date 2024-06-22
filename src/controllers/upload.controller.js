"use strict";

const { OK } = require("../core/success.response");
const XLSX = require("../libs/xlsx.lib");

class UploadController {
    async uploadLocalFileXlsx(req, res) {
        const { file } = req;

        const response = await XLSX.readAsync(file.path);

        return new OK({ message: "Upload xlsx file successfully", metadata: response }).send(res);
    }
}

module.exports = new UploadController();
