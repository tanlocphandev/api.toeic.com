"use strict";

const { format, raw } = require("mysql2");
const { ServerError, BadRequestError } = require("../core/error.response");
const { database } = require("../db/mysql.db");
const _ = require("lodash");

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

        const { query, value } = this.buildWhereClause(conditions);

        const sql = format(`UPDATE ?? SET ? ${query}`, [this.tableName, data, ...value]);

        return await this.db.execute(sql);
    }

    delete() {}

    deleteOne(conditions) {
        if (!conditions) throw new BadRequestError("Data not found!");

        const { query, value } = this.buildWhereClause(conditions);

        const sql = format(`DELETE FROM ?? ${query}`, [this.tableName, ...value]);

        return this.db.execute(sql);
    }

    async find(conditions = null) {
        let query = `SELECT * FROM ??`;
        let params = [this.tableName];

        if (conditions) {
            const { query: whereQuery, value } = this.buildWhereClause(conditions);
            query = `${query} ${whereQuery}`;
            params.push(...value);
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
            const { query: whereQuery, value } = this.buildWhereClause(where);
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

    buildWhereClause(where) {
        if (_.isEmpty(where)) return { query: "", value: null };

        const { condition, newValue } = this.formatConditions(where);

        return { query: `WHERE ${condition}`, value: newValue };
    }

    formatConditions(conditions) {
        let newValue = [];

        const condition = Object.entries(conditions)
            .map(([key, value]) => {
                const { condition, value: _value } = this.formatValue(value);
                let isObjectOfRaw = false;

                if (condition === "?" || typeof value === "object") {
                    newValue = [...newValue, _value];

                    if (typeof _value === "object" && Object.getOwnPropertyNames("toSqlString")) {
                        isObjectOfRaw = true;
                    }
                }

                return `${key} ${condition === "?" && !isObjectOfRaw ? `= ?` : condition}`;
            })
            .join(" AND ");

        return { condition, newValue };
    }

    formatValue(inputValue) {
        let condition = "";
        let formattedValue = "";

        if (typeof inputValue === "object") {
            Object.entries(inputValue).forEach(([key, value]) => {
                condition = key;
                formattedValue = value;
            });

            return { condition, value: formattedValue };
        }

        const value = String(inputValue)?.toLowerCase();

        if (value === "null" || value === "undefined") {
            condition = "IS NULL";
        } else if (value === "!null") {
            condition = "IS NOT NULL";
        } else {
            condition = "?";
            formattedValue = value;
        }

        return { condition, value: formattedValue };
    }

    async findOne(conditions) {
        const { query, value } = this.buildWhereClause(conditions);

        const sql = format(`SELECT * FROM ?? ${query}`, [this.tableName, ...value]);

        const [result] = await this.db.query(sql);

        return result;
    }

    count() {}
}

module.exports = BaseModel;
