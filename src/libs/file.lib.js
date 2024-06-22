"use strict";

const fs = require("fs");

class FileLib {
    static deleteFile(path) {
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
}

module.exports = FileLib;
