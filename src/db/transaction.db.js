"use strict";

const { format } = require("mysql2");
const { database } = require("./mysql.db");
const QueryHelper = require("../helpers/query.helper");

class Transaction {
    static async startTransaction() {
        return await database.beginTransaction();
    }

    static async commit(connection) {
        return await database.commit(connection);
    }

    static async rollback(connection) {
        return await database.rollback(connection);
    }

    static async release(connection) {
        return await database.release(connection);
    }

    static async releaseAll() {
        return await database.releaseAll();
    }

    static async close() {
        return await database.close();
    }

    static async insert({ data, tableName, connection }) {
        const sql = format(`INSERT INTO ?? SET ?`, [tableName, data]);
        return await connection.execute(sql);
    }

    static async insertBulk({ data, tableName, fields = [], connection }) {
        const sql = format(`INSERT INTO ?? (??) VALUES ?`, [tableName, fields, data]);
        return await connection.execute(sql);
    }

    static async update({ data, tableName, conditions, connection }) {
        const { query, value } = QueryHelper.buildWhereClause(conditions);
        const sql = format(`UPDATE ?? SET ? ${query}`, [tableName, data, ...value]);
        return await connection.execute(sql);
    }

    static async delete({ tableName, conditions, connection }) {
        const { query, value } = QueryHelper.buildWhereClause(conditions);
        const sql = format(`DELETE FROM ?? ${query}`, [tableName, ...value]);
        return await connection.execute(sql);
    }

    static async findOne({ tableName, conditions, connection }) {
        const { query, value } = QueryHelper.buildWhereClause(conditions);
        const sql = format(`SELECT * FROM ?? ${query}`, [tableName, ...value]);
        const [result] = await connection.query(sql);
        return result.length ? result[0] : null;
    }

    static async find({ tableName, conditions, connection }) {
        let query = `SELECT * FROM ??`;
        let params = [tableName];

        if (conditions) {
            const { query: whereQuery, value } = QueryHelper.buildWhereClause(conditions);
            query = `${query} ${whereQuery}`;
            params.push(...value);
        }

        const sql = format(query, params);

        const [result] = await connection.query(sql);
        return result;
    }
}

module.exports = Transaction;
