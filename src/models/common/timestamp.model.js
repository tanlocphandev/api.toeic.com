"use strict";

/**
 * Represents a class that stores timestamps.
 *
 * @class
 * @property {Date} created_at - The timestamp when the instance was created.
 * @property {Date} updated_at - The timestamp when the instance was last updated.
 */
class TimestampModel {
    /**
     * Creates an instance of TimestampModel.
     *
     * @param {Object} options - The options for creating the instance.
     * @param {Date} options.created_at - The timestamp when the instance was created.
     * @param {Date} options.updated_at - The timestamp when the instance was last updated.
     */
    constructor({ created_at, updated_at }) {
        /**
         * The timestamp when the instance was created.
         * @type {Date}
         */
        this.created_at = created_at;

        /**
         * The timestamp when the instance was last updated.
         * @type {Date}
         */
        this.updated_at = updated_at;
    }
}

module.exports = TimestampModel;
