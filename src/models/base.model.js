"use strict";

const { ServerError } = require("../core/error.response");
const { database } = require("../db/mysql.db");

class BaseModel {
    constructor() {
        this.checkTableExists();
        this.db = database;
    }

    static get tableName() {
        return "";
    }

    checkTableExists() {
        if (!BaseModel.tableName) throw new ServerError("tableName not set");
    }

    async insert(data) {
        const sql = `INSERT INTO ${BaseModel.tableName} SET ?`;

        return await this.db.execute(sql, [data]);
    }

    insertBulk() {}

    update() {}

    delete() {}

    find() {
        const sql = `SELECT * FROM ${BaseModel.tableName}`;

        return this.db.query(sql);
    }

    findOne() {}

    count() {}
}

module.exports = BaseModel;
