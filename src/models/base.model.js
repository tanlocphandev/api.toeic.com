"use strict";

const { format } = require("mysql2");
const { ServerError, BadRequestError } = require("../core/error.response");
const { database } = require("../db/mysql.db");

class BaseModel {
    constructor() {
        this.checkTableExists();
        this.db = database;
    }

    get tableName() {
        return "";
    }

    checkTableExists() {
        if (!this.tableName) throw new ServerError("tableName not set");
    }

    async insert(data) {
        if (!data) throw new BadRequestError("Data not found!");

        const sql = format(`INSERT INTO ?? SET ?`, [this.tableName, data]);

        return await this.db.execute(sql);
    }

    insertBulk() {}

    update() {}

    delete() {}

    find() {
        const sql = format(`SELECT * FROM ??`, [this.tableName]);
        return this.db.query(sql);
    }

    async findOne(conditions) {
        const sql = format(`SELECT * FROM ?? WHERE ?`, [this.tableName, conditions]);
        return await this.db.query(sql);
    }

    count() {}
}

module.exports = BaseModel;
