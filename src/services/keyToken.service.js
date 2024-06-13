"use strict";

const { keyTokenModel } = require("../models/keyToken.model");

class KeyTokenService {
    static async create({ userId, publicKey, privateKey, refreshToken }) {
        const filter = { user_id: userId },
            update = {
                private_key: privateKey,
                public_key: publicKey,
                refresh_token: refreshToken,
            },
            options = { upsert: true, new: true };

        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

        return tokens;
    }
}

module.exports = KeyTokenService;
