/*
 * MiniCore module
 *
 * Provides a simplest set of some basic utils.
 * Should be used internally.
 */

var Mini = {};

var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var isArrayLike = function(collection) {
    if (collection === null || collection === undefined) return 0;
    var length = collection['length'];
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

/**
 * Check if something is array-like
 *
 * @param collection anything to check
 * @return {boolean}
 * @type {isArrayLike}
 */
Mini.isArrayLike = isArrayLike;

/**
 * Iterates on an array. Fast and should not be used on objects.
 *
 * @private
 * @param {Array} array
 * @param {Function} iteratee
 * @returns {Array} result map
 */
Mini.arrayEach = function(array, iteratee) {
    var length = array.length;

    if (isArrayLike(array) && length > 0) {
        var result = [];
        var n = length;
        length++;
        while (--length) {
            result[n - length] = iteratee(array[n - length]);
        }
        return result;
    }
};

module.exports = Mini;