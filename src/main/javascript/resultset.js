/*
 * ResultSet Module
 */
var RS = {};
var H = require('lodash/core');
var ARS = require('./abstractresultset');
var I = require('./iterator');

var RsIdentifier = '__isRS__';

//the default ResultSet should not exclude any values
//noinspection JSUnusedLocalSymbols
function checker(val) {
    return !val['__isRoot__'];
}

//default channel doesn't need filter
ARS.registerChannel(RsIdentifier, [Array.prototype, Object.prototype], checker);

function registerComponent(name, func) {
    ARS.registerChannelFunction(RsIdentifier, name, func);
}

function wrapFunction(fn) {
    return function() {
        if (checker(arguments[0])) {
            return fn.apply(this, arguments);
        }
    }
}

/*
 * ResultSet Operations
 */
/**
 * Iterates an Array or Object, promise version
 *
 * @param {*} fn iterator function
 * @returns {Array|Object} result composed by return statement
 */
function each(fn) {
    //patch `fn`
    arguments[0] = wrapFunction(arguments[0]);
    return I.each.apply(H, [this].concat(Array.prototype.slice.call(arguments)));
}

/**
 * Iterates an Array or Object, return the filtered result, promise ver
 *
 * @param {Function} fn filter function
 * @returns {Array|Object} filtered result
 */
function filter(fn) {
    fn = wrapFunction(fn);
    return I.each(this, function(o) {
        if (fn(o)) {
            return o;
        }
    });
}

/**
 * Sort an Array or values of an Object, return the sorted array, promise ver
 *
 * @param {Function} fn sort function
 * @returns {*|Array} sorted array
 */
function sortBy(fn) {
    fn = wrapFunction(fn);
    return H.sortBy(this, fn);
}

/**
 * Returns the value array of an object or itself of an array.
 *
 * @returns {*|Array}
 */
function toArray() {
    return H.values(this);
}

/**
 * Return grouped values by a grouping function of an array or an object
 *
 * @param {Function} fn grouping function
 * @returns {*}
 */
function groupBy(fn) {
    fn = wrapFunction(fn);
    return H.groupBy(this, fn);
}

/**
 * Joins an array or the value array of an object
 *
 * @param {String} separator result separator
 * @returns {string} joined string
 */
function join(separator) {
    return H.values(this).join(separator || "");
}

/**
 * Sums all numbers in an array or value array of an object
 *
 * @returns {number} sum value
 */
function sum() {
    var s = 0;
    I.each(this || [], function(v) {
        var nv = H.isInteger(v) ? parseInt(v) : (H.isFloat(v) ? parseFloat(v) : NaN);
        if (!isNaN(nv)) {
            s += nv;
        }
    });
    return s;
}

/**
 * Returns the length of an array or the value array of an object
 *
 * @returns {Number} length
 * @constructor
 */
function getLength() {
    return H.values(this).length;
}

/**
 * Returns the array itself or the value array of an object
 *
 * @returns {*|Array} result array
 */
function values() {
    return H.values(this);
}

/**
 * Returns the key array of an object or the index array of an array
 *
 * @returns {*|Array} key array
 */
function keys() {
    return H.keys(this);
}

/**
 * Returns the flatten array of an nested array.
 *
 * @returns {*|Array}
 */
function flatten() {
    return H.flatten(this) || [];
}

registerComponent("each",    each);
registerComponent("filter",  filter);
registerComponent("sortBy",  sortBy);
registerComponent("toArray", toArray);
registerComponent("groupBy", groupBy);
registerComponent("join",    join);
registerComponent("sum",     sum);
registerComponent("Length",  getLength);
registerComponent("values",  values);
registerComponent("keys",    keys);
registerComponent("flatten", flatten);

/**
 * Wrap an object to default ResultSet
 *
 * @static
 * @memberof H
 * @param {Array|Object} v anything to wrap
 * @returns {*} wrapped ResultSet object
 */
var wrap = ARS.wrapperGen(RsIdentifier);

RS.wrap = wrap;
/**
 * @deprecated
 * @type {wrap}
 */
RS.fastWrap = wrap;

module.exports = RS;
