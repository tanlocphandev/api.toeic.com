"use strict";

const _ = require("lodash");

/**
 * Generates a random string of the specified length.
 *
 * @param {number} [length=12] - The length of the random string to generate. Defaults to 12.
 * @param {boolean} [isLowerCase=false] - Whether to convert the generated string to lowercase. Defaults to false.
 * @return {string} - The generated random string.
 */
const generateRandomString = (length = 12, isLowerCase = false) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return isLowerCase ? result.toLocaleLowerCase() : result;
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

module.exports = { generateRandomString, getInfoData };
