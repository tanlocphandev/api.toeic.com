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

    static async findByUserId(userId) {
        return await keyTokenModel.findOne({ user_id: userId });
    }

    static async removeById(keyId) {
        return await keyTokenModel.deleteOne({ key_id: keyId });
    }

    static async updateById(keyId, updatePayload) {
        return await keyTokenModel.updateOne({ key_id: keyId }, updatePayload);
    }
}

module.exports = KeyTokenService;
