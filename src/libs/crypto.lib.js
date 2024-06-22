"use strict";

const crypto = require("node:crypto");

class Crypto {
    static generateKey(size = 64) {
        return crypto.randomBytes(size).toString("hex");
    }
}

module.exports = Crypto;
