"use strict";

const { OK } = require("../core/success.response");
const XLSX = require("../libs/xlsx.lib");
const UploadServicer = require("../services/upload.service");

class UploadController {
    async uploadLocalFileXlsx(req, res) {
        const { file } = req;

        const response = await XLSX.readAsync(file.path);

        return new OK({ message: "Upload xlsx file successfully", metadata: response }).send(res);
    }

    async uploadQuestion(req, res) {
        const { file } = req;

        const response = await XLSX.readAsync(file.path);

        const data = UploadServicer.handleUploadQuestion(response);

        const dataUpload = await UploadServicer.handleUploadQuestionToCloud(data);

        return new OK({ message: "Upload question file successfully", metadata: dataUpload }).send(
            res
        );
    }
}

module.exports = new UploadController();
