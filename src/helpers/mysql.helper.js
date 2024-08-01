"use strict";

const { raw } = require("mysql2");

class MysqlHelper {
    /**
     * Generates a raw MySQL query to increment the value of a column by a given value.
     *
     * @param {string} column - The name of the column to increment.
     * @param {number} value - The amount by which to increment the column.
     * @return {Raw} - A raw MySQL query object.
     */
    static inc(column, value) {
        return raw(`\`${column}\` + ${value}`);
    }

    static decrease(column, value) {
        return raw(`\`${column}\` - ${value}`);
    }

    static in(value = []) {
        return {
            "?": raw(`IN (${value.join(",")})`),
        };
    }

    /**
     * Generates a raw MySQL query to compare a column value to a given value
     * using a greater than or equal to operator.
     *
     * @param {any} value - The value to compare the column to.
     * @return {Object} - An object containing a single key-value pair where the key is "?" and the value is a raw MySQL query string.
     */
    static gte(value) {
        return {
            "?": raw(`>= ${value}`),
        };
    }

    static query(query) {
        return {
            "?": raw(query),
        };
    }

    /**
     * Generates a raw MySQL query to compare a column value to a given value
     * using a greater than operator.
     *
     * @param {any} value - The value to compare the column to.
     * @return {Object} - An object containing a single key-value pair where the key is "?" and the value is a raw MySQL query string.
     */
    static gt(value) {
        return {
            "?": raw(`> ${value}`),
        };
    }

    /**
     * Generates a raw MySQL query to compare a column value to a given value
     * using a less than or equal to operator.
     *
     * @param {any} value - The value to compare the column to.
     * @return {Object} - An object containing a single key-value pair where the key is "?" and the value is a raw MySQL query string.
     */
    static lte(value) {
        return {
            "?": raw(`<= ${value}`),
        };
    }

    /**
     * Generates a raw MySQL query to compare a column value to a given value
     * using an exact match operator.
     *
     * @param {any} value - The value to compare the column to.
     * @return {Object} - An object containing a single key-value pair where the key is "?" and the value is a raw MySQL query string.
     */
    static eq(value) {
        return {
            "?": raw(`= ${value}`),
        };
    }

    /**
     * Generates a raw MySQL query to compare a column value to a given value
     * using a not equal to operator.
     *
     * @param {any} value - The value to compare the column to.
     * @return {Object} - An object containing a single key-value pair where the key is "?" and the value is a raw MySQL query string.
     *
     */
    static neq(value) {
        return {
            "?": raw(`!= ${value}`),
        };
    }

    static isNull() {
        return {
            "?": raw("IS NULL"),
        };
    }

    static isNotNull() {
        return {
            "?": raw("IS NOT NULL"),
        };
    }
}

module.exports = MysqlHelper;
