"use strict";

const crypto = require("node:crypto");

class Crypto {
    static generateKey() {
        return crypto.randomBytes(64).toString("hex");
    }
}

module.exports = Crypto;
