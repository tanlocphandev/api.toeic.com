"use strict";

class TimestampModel {
    constructor({ created_at, updated_at }) {
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = TimestampModel;
