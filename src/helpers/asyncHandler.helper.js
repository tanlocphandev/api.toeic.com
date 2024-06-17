"use strict";

/**
 * A higher-order function that wraps asynchronous route handlers to catch any errors that occur during execution.
 *
 * @param {Function} fn - The asynchronous route handler function.
 * @return {Function} - Returns a function that handles asynchronous operations and catches errors.
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = asyncHandler;
