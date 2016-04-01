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

Mini.isArrayLike = isArrayLike;

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