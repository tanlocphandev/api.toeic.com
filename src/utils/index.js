"use strict";

const _ = require("lodash");
const slugify = require("slugify");
const Crypto = require("../libs/crypto.lib");

/**
 * Generates a random string of the specified length.
 *
 * @param {number} [length=12] - The length of the random string to generate. Defaults to 12.
 * @return {string} - The generated random string.
 */
const generateRandomString = (length = 12) => {
    return Crypto.generateKey(length);
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
        if (!Object.hasOwn(_instance, String(key).replace("LOWER(", "").replace(")", ""))) {
            delete fields[key];
        }
    });

    return fields;
};

/**
 * Checks if the input string is a valid URL.
 *
 * @param {string} str - The input string to check.
 * @return {boolean} - Returns true if the input string is a valid URL, false otherwise.
 *
 * This function uses a regular expression to check if the input string is a valid URL.
 * The regular expression used is as follows:
 *
 *   /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-\/]))?/
 *
 * This regular expression matches the following:
 *
 *   - protocol (ftp, http, https)
 *   - domain name
 *   - port number (optional)
 *   - path (optional)
 *   - query string (optional)
 *   - fragment (optional)
 */
const isUrl = (str) => {
    const regexp = /^(?:ftp|http|https):\/\/(?:(?:(?!:).)*\.)[^.]+$/;
    return regexp.test(str);
};

/**
 * Filters the extension from a given string.
 *
 * @param {string} str - The input string.
 * @return {string} The string without the extension.
 */
const filterExtFilePath = (str) => {
    return str.split(".").slice(0, -1).join(".");
};

/**
 * Generates a random number with the specified length.
 *
 * @param {number} [length=12] - The length of the random number to generate. Defaults to 12.
 * @return {number} - The generated random number.
 */
const randomNumber = (length = 12) => {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1));
};

/**
 * Maps a value based on the provided parameters.
 * @param {object} options - An object containing the fields and object to pick from.
 * @param {string} options.rawValue - The raw value to be mapped.
 * @param {boolean} [options.isJson=false] - A flag indicating if the raw value is JSON.
 * @param {any} [options.defaultValue=null] - The default value to return if mapping fails.
 * @return {any} The mapped value based on the parameters.
 */
const mapValue = ({ rawValue, isJson = false, defaultValue = null }) => {
    if (isJson) {
        return rawValue ? JSON.stringify(rawValue) : defaultValue;
    }

    return rawValue || defaultValue;
};

/**
 * Parses a JSON value from a given input.
 *
 * @param {Object} options - The options object.
 * @param {string} options.value - The JSON value to parse.
 * @param {any} [options.defaultValue=null] - The default value to return if parsing fails.
 * @return {any} The parsed JSON value or the default value.
 */
const parseValueToJson = ({ value, defaultValue = null }) => {
    return value ? JSON.parse(value) : defaultValue;
};

/**
 * Asynchronously processes tasks in a pool with a limit.
 *
 * @param {number} poolLimit - The maximum number of tasks to execute concurrently.
 * @param {Array} array - The array of items to process asynchronously.
 * @param {Function} iteratorFn - The function that processes each item in the array.
 * @return {Promise} A promise that resolves when all tasks are completed.
 */
const asyncPool = (poolLimit, array, iteratorFn) => {
    let i = 0;
    const ret = []; // Lưu trữ tất cả các tác vụ không đồng bộ
    const executing = []; // Lưu trữ các tác vụ không đồng bộ đang được thực thi

    const enqueue = function () {
        if (i === array.length) {
            return Promise.resolve();
        }

        const item = array[i++]; // Nhận một mục nhiệm vụ mới
        const p = Promise.resolve().then(() => iteratorFn(item, i, array));
        ret.push(p);

        let r = Promise.resolve();

        if (poolLimit <= array.length) {
            // Khi nhiệm vụ đã hoàn thành, hãy xóa nhiệm vụ đã hoàn thành khỏi mảng nhiệm vụ đang được thực thi
            const e = p.then(() => executing.splice(executing.indexOf(e), 1));
            executing.push(e);

            if (executing.length >= poolLimit) {
                r = Promise.race(executing);
            }
        }

        // Sau khi tác vụ nhanh hơn trong danh sách tác vụ được thực thi, tác vụ cần làm mới sẽ nhận được từ mảng
        return r.then(() => enqueue());
    };

    return enqueue().then(() => Promise.all(ret));
};

/**
 * Filters out invalid properties from an object.
 *
 * @param {object} inputObject - The object to filter.
 * @returns {object} - A new object with only the valid properties.
 */
const filterInvalidProperties = (inputObject) => {
    return Object.entries(inputObject).reduce((filteredObject, [key, value]) => {
        if (value !== undefined && value !== null) {
            filteredObject[key] = value;
        }
        return filteredObject;
    }, {});
};

module.exports = {
    generateRandomString,
    getInfoData,
    mapperSelect,
    mapperUnSelect,
    generateSlug,
    filterPropOutsideInstance,
    isUrl,
    filterExtFilePath,
    randomNumber,
    mapValue,
    asyncPool,
    parseValueToJson,
    filterInvalidProperties,
};
