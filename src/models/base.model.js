"use strict";

const { format } = require("mysql2");
const { ServerError, BadRequestError } = require("../core/error.response");
const { database } = require("../db/mysql.db");

class BaseModel {
    constructor() {
        this.checkTableExists();
        this.checkIdColumnExists();
        this.db = database;
    }

    get tableName() {
        return "";
    }

    get idColumn() {
        return "";
    }

    checkTableExists() {
        if (!this.tableName) throw new ServerError("tableName not set");
    }

    checkIdColumnExists() {
        if (!this.idColumn) throw new ServerError("idColumn not set");
    }

    async insert(data) {
        if (!data) throw new BadRequestError("Data not found!");

        const sql = format(`INSERT INTO ?? SET ?`, [this.tableName, data]);

        return await this.db.execute(sql);
    }

    insertBulk() {}

    async updateById(id, data) {
        if (!data || !id) throw new BadRequestError("Data not found!");

        const sql = format(`UPDATE ?? SET ? WHERE ?? = ?`, [
            this.tableName,
            data,
            this.idColumn,
            id,
        ]);

        const [result] = await this.db.execute(sql);

        return result;
    }

    async updateOne(conditions, data) {
        if (!data || !conditions) throw new BadRequestError("Data not found!");

        const sql = format(`UPDATE ?? SET ? WHERE ?`, [this.tableName, data, conditions]);

        return await this.db.execute(sql);
    }

    delete() {}

    deleteOne(conditions) {
        if (!conditions) throw new BadRequestError("Data not found!");

        const sql = format(`DELETE FROM ?? WHERE ?`, [this.tableName, conditions]);

        return this.db.execute(sql);
    }

    async find() {
        const sql = format(`SELECT * FROM ??`, [this.tableName]);

        const result = await this.db.query(sql);

        return result;
    }

    async findOne(conditions) {
        const sql = format(`SELECT * FROM ?? WHERE ?`, [this.tableName, conditions]);

        const [result] = await this.db.query(sql);

        return result;
    }

    count() {}
}

module.exports = BaseModel;
