/*
 * Object-Related Module
 */

var O = {};
require('./stacktrace');

//variable type to be checked
/**
 * Checks if the target string contains a charsequence.
 *
 * @static
 * @memberof H
 * @param {String} str target string
 * @param {String} sub substring to check
 * @returns {boolean}
 */
O.strContains = function(str, sub) {
    return str.indexOf(sub) !== -1;
};

/**
 * Checks if the target string contains a charsequence ignoring the char case.
 *
 * @static
 * @memberof H
 * @param {String} str target string
 * @param {String} sub substring to check
 * @returns {boolean}
 */
O.strContainsIgnoreCase = function(str, sub) {
    return str.toLowerCase().indexOf(sub.toLowerCase()) !== -1;
};

O.parseJson = function(json) {
    try {
        return JSON.parse(decodeURI(json));
    } catch (e) {
        try {
            return JSON.parse(json);
        } catch (e) {
            e.printStackTrace();
        }
    }
    return undefined;
};

/**
 * Clones the object via JSON.
 * Should be used on small plain javascript objects only.
 *
 * @static
 * @memberof H
 * @param {Array|Object} obj
 * @return {Object} cloned object
 */
O.cloneByParse = function(obj) {
    //for small objects only
    return JSON.parse(JSON.stringify(obj));
};

module.exports = O;