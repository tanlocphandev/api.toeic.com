"use strict";

const { format, raw } = require("mysql2");
const { ServerError, BadRequestError } = require("../core/error.response");
const { database } = require("../db/mysql.db");
const _ = require("lodash");
const QueryHelper = require("../helpers/query.helper");

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

    async insertBulk({ data = [], fields = [] }) {
        if (!data.length || !fields.length) throw new BadRequestError("Data not found!");

        const sql = format(`INSERT INTO ?? (??) VALUES ?`, [this.tableName, fields, data]);

        return await this.db.execute(sql);
    }

    async updateById(id, data) {
        if (!data || !id) throw new BadRequestError("Data not found!");

        const sql = format(`UPDATE ?? SET ? WHERE ?? = ?`, [
            this.tableName,
            data,
            this.idColumn,
            id,
        ]);

        const result = await this.db.execute(sql);

        return result;
    }

    async updateOne(conditions, data) {
        if (!data || !conditions) throw new BadRequestError("Data not found!");

        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`UPDATE ?? SET ? ${query}`, [this.tableName, data, ...value]);

        return await this.db.execute(sql);
    }

    async updateMany(conditions, data) {
        if (!data || !conditions) throw new BadRequestError("Data not found!");

        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`UPDATE ?? SET ? ${query}`, [this.tableName, data, ...value]);

        console.log(`sql update many`, sql);

        return await this.db.execute(sql);
    }

    async deleteOne(conditions) {
        if (!conditions) throw new BadRequestError("Data not found!");

        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`DELETE FROM ?? ${query}`, [this.tableName, ...value]);

        return await this.db.execute(sql);
    }

    async deleteMany(conditions) {
        if (!conditions) throw new BadRequestError("Data not found!");

        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`DELETE FROM ?? ${query}`, [this.tableName, ...value]);

        console.log(`sql delete many`, sql);

        return await this.db.execute(sql);
    }

    async find(conditions = null, order = {}) {
        let query = `SELECT * FROM ??`;
        let params = [this.tableName];

        if (conditions && !_.isEmpty(conditions)) {
            const { query: whereQuery, value } = QueryHelper.buildWhereClause(conditions);
            query = `${query} ${whereQuery}`;
            params.push(...value);
        }

        if (!_.isEmpty(order)) {
            params.push(order.key, raw(order.value));
            query += ` ORDER BY ?? ?`;
        }

        const sql = format(query, params);

        console.log({ sql });

        const result = await this.db.query(sql);

        return result;
    }

    async findAndCountAll({ where = {}, limit = 10, offset = 0, order = {} }) {
        let baseQuery = `SELECT * FROM ??`;
        let countQuery = `SELECT COUNT(*) as count FROM ??`;
        const params = [this.tableName];
        const paramsCount = [this.tableName];

        if (!_.isEmpty(where)) {
            const { query: whereQuery, value } = QueryHelper.buildWhereClause(where);
            baseQuery = `${baseQuery} ${whereQuery}`;
            countQuery = `${countQuery} ${whereQuery}`;
            params.push(...value);
            paramsCount.push(...value);
        }

        if (!_.isEmpty(order)) {
            params.push(order.key, raw(order.value));
            baseQuery += ` ORDER BY ?? ?`;
        }

        params.push(limit, offset);
        baseQuery += ` LIMIT ? OFFSET ?`;

        // console.log({ baseQuery: format(baseQuery, params), params });

        const [[resultCount], result] = await Promise.all([
            this.db.query(format(countQuery, paramsCount)),
            this.db.query(format(baseQuery, params)),
        ]);

        const totalPage = Math.ceil(resultCount.count / limit);

        return {
            data: result,
            totalRow: resultCount.count,
            totalPage,
        };
    }

    async findOne(conditions, order = null) {
        const { query, value } = QueryHelper.buildWhereClause(conditions);

        let sql = `SELECT * FROM ?? ${query}`;
        const params = [this.tableName, ...value];

        if (order) {
            sql += ` ORDER BY ?? ${order.value}`;
            params.push(order.key);
        }

        sql += ` LIMIT 1`;

        sql = format(sql, params);

        const [result] = await this.db.query(sql);

        return result;
    }

    async count(conditions) {
        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`SELECT COUNT(*) as count FROM ?? ${query}`, [this.tableName, ...value]);

        const [result] = await this.db.query(sql);

        return result.count;
    }

    async callProcedure({ procedureName, params = [] }) {
        const sql = format(`CALL ?? (?)`, [procedureName, params]);

        console.log("====================================");
        console.log(`callProcedure::`, sql);
        console.log("====================================");
        const [results] = await this.db.query(sql);
        return results;
    }
}

module.exports = BaseModel;
