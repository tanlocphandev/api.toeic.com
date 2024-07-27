"use strict";

const { raw } = require("mysql2");
const _ = require("lodash");

class QueryHelper {
    static getPagination(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;
        let _query = {};
        let order = {};
        let isGetAll = query.all === "true" ? true : false;
        let withInclude = query.include === "true" ? true : false;

        if (query.query) {
            const queryString = String(query.query).split(";");

            queryString.forEach((q) => {
                const [key, value] = q.split(":");
                _query[key] = value;
            });
        }

        if (query.queryLike) {
            const queryString = String(query.queryLike).split(";");

            queryString.forEach((q) => {
                const [key, value] = q.split(":");
                _query[`LOWER(${key})`] = {
                    "?": raw(`LIKE '%${value.toLowerCase()}%'`),
                };
            });
        }

        if (query.order) {
            const [key, value] = String(query.order).split(",");
            order = { key: key, value: value?.toUpperCase() || "ASC" };
        }

        return { page, limit, offset, query: _query, order, isGetAll, withInclude };
    }

    static buildWhereClause(where) {
        if (_.isEmpty(where)) return { query: "", value: null };

        const { condition, newValue } = QueryHelper.formatConditions(where);

        return { query: `WHERE ${condition}`, value: newValue };
    }

    static formatConditions(conditions) {
        let newValue = [];

        const condition = Object.entries(conditions)
            .map(([key, value]) => {
                const { condition, value: _value } = QueryHelper.formatValue(value);
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

    static formatValue(inputValue) {
        let condition = "";
        let formattedValue = "";

        // console.log(`inputValue:::`, { type: typeof inputValue, value: inputValue });

        if (typeof inputValue === "object" && inputValue !== null) {
            Object.entries(inputValue).forEach(([key, value]) => {
                condition = key;
                formattedValue = value;
            });

            return { condition, value: formattedValue };
        }

        const value = inputValue === null ? "null" : String(inputValue)?.toLowerCase();

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
}

module.exports = QueryHelper;
