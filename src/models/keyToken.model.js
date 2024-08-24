"use strict";

const BaseModel = require("./base.model");
const { generateRandomString, randomNumber } = require("../utils");
const TimestampModel = require("./common/timestamp.model");

class KeyTokenDao extends TimestampModel {
    constructor({
        key_id,
        user_id,
        public_key,
        private_key,
        refresh_token_used,
        refresh_token,
        created_at,
        updated_at,
    }) {
        super({ created_at, updated_at });

        this.key_id = key_id;
        this.user_id = user_id;
        this.public_key = public_key;
        this.private_key = private_key;
        this.refresh_token_used = refresh_token_used;
        this.refresh_token = refresh_token;
    }
}

class KeyTokenModel extends BaseModel {
    get tableName() {
        return "key_tokens";
    }

    get idColumn() {
        return "key_id";
    }

    async findOneAndUpdate(filter, update, options = { upsert: false, new: false }) {
        const result = await super.findOne(filter);

        if (!result) {
            if (options.upsert) {
                const keyId = randomNumber(16);

                const insert = { ...update, ...filter, key_id: keyId };

                await super.insert(insert);

                return options.new ? await super.findOne({ key_id: keyId }) : keyId;
            }

            return null;
        }

        const keyToken = new KeyTokenDao(result);

        delete keyToken.created_at;
        delete keyToken.updated_at;

        const newUpdate = Object.assign(keyToken, update);

        await super.updateOne(filter, newUpdate);

        if (options.new) {
            return newUpdate;
        }

        return keyToken.key_id;
    }
}

const keyTokenModel = new KeyTokenModel();

module.exports = { keyTokenModel, KeyTokenDao };
