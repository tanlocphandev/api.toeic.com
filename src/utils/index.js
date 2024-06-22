"use strict";

const _ = require("lodash");
const slugify = require("slugify");
const crypto = require("node:crypto");

/**
 * Generates a random string of the specified length.
 *
 * @param {number} [length=12] - The length of the random string to generate. Defaults to 12.
 * @return {string} - The generated random string.
 */
const generateRandomString = (length = 12) => {
    return crypto.randomBytes(length).toString("hex");
};

/**
 * Returns a new object that contains only the specified fields from the given object.
 *
 * @param {Object} options - An object containing the fields and object to pick from.
 * @param {Array} options.fields - An array of field names to pick from the object. Defaults to an empty array.
 * @param {Object} options.object - The object to pick fields from. Defaults to an empty object.
 * @return {Object} - A new object that contains only the specified fields from the given object.
 */
const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
};

/**
 * Returns a new object that contains only the specified fields from the given object.
 *
 * @param {Object} row - The object to pick fields from.
 * @param {Array} [selects=[]] - An array of field names to pick from the object. Defaults to an empty array.
 * @return {Object} - A new object that contains only the specified fields from the given object.
 */
const mapperSelect = (row, selects = []) => {
    if (!selects.length) return row;
    return getInfoData({ fields: selects, object: row });
};

/**
 * Returns a new object that contains only the specified fields from the given object.
 *
 * @param {Object} row - The object to pick fields from.
 * @param {Array} [unselects=[]] - An array of field names to exclude from the new object. Defaults to an empty array.
 * @return {Object} - A new object that contains only the specified fields from the given object, excluding the fields in the unselects array.
 */
const mapperUnSelect = (row, unselects = []) => {
    if (!unselects.length) return user;
    const selects = Object.keys(row).filter((key) => !unselects.includes(key));
    return getInfoData({ fields: selects, object: row });
};

/**
 * Generates a slug from the given value.
 *
 * @param {string} value - The value to generate the slug from.
 * @return {string} The generated slug.
 */
const generateSlug = (value) => {
    return slugify(value, {
        replacement: "-", // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        strict: true, // strip special characters except replacement, defaults to `false`
        locale: "vi", // language code of the locale to use
        trim: true, // trim leading and trailing replacement chars, defaults to `true`
    });
};

/**
 * Filters out properties from the given fields object that are not present in the instance object.
 *
 * @param {Object} options - The options object.
 * @param {Object} options.instance - The instance object to check against.
 * @param {Object} [options.fields={}] - The fields object to filter.
 * @return {Object} - The filtered fields object.
 */
const filterPropOutsideInstance = ({ instance, fields = {} }) => {
    if (_.isEmpty(fields)) return {};

    const _instance = instance.getInstance();

    Object.keys(fields).forEach((key) => {
        if (!Object.hasOwn(_instance, key)) {
            delete fields[key];
        }
    });

    return fields;
};

module.exports = {
    generateRandomString,
    getInfoData,
    mapperSelect,
    mapperUnSelect,
    generateSlug,
    filterPropOutsideInstance,
};
