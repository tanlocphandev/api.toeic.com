"use strict";

const { OK } = require("../core/success.response");
const cloudinary = require("../libs/cloudinary.lib");
const FileLib = require("../libs/file.lib");
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

        const { totalAnswer, questionTypes, result } =
            UploadServicer.handleUploadQuestion(response);

        const dataUpload = await UploadServicer.handleUploadQuestionToCloud({
            data: result,
            ...req.body,
        });

        return new OK({
            message: "Upload question file successfully",
            metadata: { ...dataUpload, totalAnswer, questionTypes, dataDefault: response },
        }).send(res);
    }

    async uploadScore(req, res) {
        const { scores = [] } = req.body;
        return new OK({
            message: "Upload score file successfully",
            metadata: scores,
        }).send(res);
    }

    async uploadAudio(req, res) {
        const { file } = req;
        const { testOfYear, testNoOfYear } = req.body;

        const publicId = `toeic/${testOfYear}/test${testNoOfYear}`;

        const response = await cloudinary.upload({
            file: file.path,
            folder: "audio",
            publicId: publicId,
            resource_type: "video",
        });

        // After read file success, delete file
        FileLib.deleteFile(file.path);

        return new OK({
            message: "Upload audio file successfully",
            metadata: cloudinary.getInfoUpload(response),
        }).send(res);
    }
}

module.exports = new UploadController();
