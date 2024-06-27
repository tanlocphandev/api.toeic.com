"use strict";

const TimestampModel = require("./timestamp.model");

/**
 * Represents a class that stores soft delete timestamps.
 *
 * @class
 * @property {Date} deleted_at - The timestamp when the instance was deleted.
 * @property {Date} created_at - The timestamp when the instance was created.
 * @property {Date} updated_at - The timestamp when the instance was last updated.
 */
class SoftDeleteModel extends TimestampModel {
    /**
     * Creates an instance of SoftDeleteModel.
     *
     * @param {Object} options - The options for creating the instance.
     * @param {Date} options.deleted_at - The timestamp when the instance was deleted.
     * @param {Date} options.created_at - The timestamp when the instance was created.
     * @param {Date} options.updated_at - The timestamp when the instance was last updated.
     */
    constructor({ deleted_at, created_at, updated_at }) {
        super({ created_at, updated_at });
        this.deleted_at = deleted_at;
    }
}

module.exports = SoftDeleteModel;
