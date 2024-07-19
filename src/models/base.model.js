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

    deleteOne(conditions) {
        if (!conditions) throw new BadRequestError("Data not found!");

        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`DELETE FROM ?? ${query}`, [this.tableName, ...value]);

        return this.db.execute(sql);
    }

    async find(conditions = null, order = {}) {
        let query = `SELECT * FROM ??`;
        let params = [this.tableName];

        if (conditions) {
            const { query: whereQuery, value } = QueryHelper.buildWhereClause(conditions);
            query = `${query} ${whereQuery}`;
            params.push(...value);
        }

        if (!_.isEmpty(order)) {
            params.push(order.key, raw(order.value));
            query += ` ORDER BY ?? ?`;
        }

        const sql = format(query, params);

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

    async findOne(conditions) {
        const { query, value } = QueryHelper.buildWhereClause(conditions);

        const sql = format(`SELECT * FROM ?? ${query}`, [this.tableName, ...value]);

        const [result] = await this.db.query(sql);

        return result;
    }

    count() {}
}

module.exports = BaseModel;
