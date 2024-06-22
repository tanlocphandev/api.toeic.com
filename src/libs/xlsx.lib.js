"use strict";

const xlsx = require("xlsx");
const stream = require("node:stream");
const FileLib = require("./file.lib");

xlsx.stream.set_readable(stream.Readable);

class XLSX {
    static readAsync(path) {
        return new Promise((resolve, reject) => {
            try {
                const workbook = xlsx.readFile(path);
                const workbookSheet = workbook.SheetNames;
                const workbookResponse = xlsx.utils.sheet_to_json(
                    workbook.Sheets[workbookSheet[0]]
                );

                // After read file success, delete file
                FileLib.deleteFile(path);

                resolve(workbookResponse);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = XLSX;
