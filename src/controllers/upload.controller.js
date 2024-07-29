"use strict";

const { OK } = require("../core/success.response");
const cloudinary = require("../libs/cloudinary.lib");
const FileLib = require("../libs/file.lib");
const XLSX = require("../libs/xlsx.lib");
const UploadServicer = require("../services/upload.service");
const { filterExtFilePath, limitSizeFile } = require("../utils");

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
        const { testOfYear, testNoOfYear, folder } = req.body;

        const _folder = folder || `toeic/${testOfYear}/test${testNoOfYear}`;

        const response = await cloudinary.upload({
            file: file.path,
            folder: _folder,
            publicId: filterExtFilePath(file.originalname),
            resource_type: "video",
        });

        // After read file success, delete file
        FileLib.deleteFile(file.path);

        return new OK({
            message: "Upload audio file successfully",
            metadata: cloudinary.getInfoUpload(response),
        }).send(res);
    }

    async uploadVideo(req, res) {
        const { file } = req;
        const folder = `toeic/documents/videos`;

        const response = await cloudinary.upload({
            file: file.path,
            folder: folder,
            publicId: filterExtFilePath(file.originalname),
            resource_type: "video",
        });

        // After read file success, delete file
        FileLib.deleteFile(file.path);

        return new OK({
            message: "Upload video file successfully",
            metadata: cloudinary.getInfoUpload(response),
        }).send(res);
    }

    async uploadImage(req, res) {
        const { file, folder } = req;
        const _folder = folder || `toeic/documents/images`;

        const response = await cloudinary.upload({
            file: file.path,
            folder: _folder,
            publicId: filterExtFilePath(file.originalname),
        });

        // After read file success, delete file
        FileLib.deleteFile(file.path);

        return new OK({
            message: "Upload image file successfully",
            metadata: cloudinary.getInfoUpload(response),
        }).send(res);
    }

    async uploadPdf(req, res) {
        const { file, folder } = req;
        const _folder = folder || `toeic/documents/pdf`;

        console.log(`file.size >= limitSizeFile(100):::`, file.size >= limitSizeFile(100));

        const response = await cloudinary.upload({
            file: file.path,
            folder: _folder,
            publicId: filterExtFilePath(file.originalname),
            resource_type: "raw",
        });

        console.log("response", response);

        // After read file success, delete file
        FileLib.deleteFile(file.path);

        return new OK({
            message: "Upload pdf file successfully",
            metadata: cloudinary.getInfoUpload(response),
        }).send(res);
    }
}

module.exports = new UploadController();
