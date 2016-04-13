/*
 * Iterator Logic Module
 */
var C = require('lodash/core');
var Mini = require('../mini');
var H = require('./stacktrace');

var I = function(template) {
    I.template = template || I.resultWrapper;
    return I;
};

/**
 * Set the default result template.
 * A result template will be used to produce a result object according to the input value.
 *
 * @static
 * @param {Function} template
 * @returns {I}
 * @constructor
 */
I.setTemplate = function(template) {
    I.template = template || I.resultWrapper;
    return I;
};

/*
 * @private
 *
 * returns a template object for the input value
 */
I.resultWrapper = function(v) {
    if (I.template !== undefined) return I.template(v);
    return (v === undefined || v === null) ? {} : (Mini.isArrayLike(v) ? [] : {});
};

/**
 * Iterates an object or an array with an iteratee and a stack of stack trace
 *
 * @static
 * @memberof H
 * @param {Array|Object} obj
 * @param {Function} fn
 * @param {Array|String} [stackStack]
 * @return {Array|Object} return mapped results of the input object
 */
I.each = function(obj, fn, stackStack) {
    stackStack = stackStack || [];
    stackStack.push(H.getStackTrace());
    var ret = I.resultWrapper(obj);
    if (H.debug) {
        C.each(obj, function(val, key, list) {
            try {
                var r = fn(val, key, list);
                if (r) ret[key] = r;
            } catch (e) {
                //E.printStackTrace only accepts one parameter
                e.printStackTrace(stackStack);
            }
        });
    } else {
        C.each(obj, function(val, key, list) {
            var r = fn(val, key, list);
            if (r) ret[key] = r;
        });
    }
    return ret;
};

/**
 * Just iterate the input object
 * @type {function((Array|Object), Function=): (Array|Object)}
 */
I.every = C.each;

/**
 * Iterator function with early quit.
 *
 * @static
 * @memberof H
 * @param {Array|Object} data data to iterate
 * @param {Function} fn function to yield result of each input
 * @param {Function} callable function to check if the itearting should be terminated
 * @param {Array} [stackStack] stack trace stack
 */
I.until = function(data, fn, callable, stackStack) {
    stackStack = stackStack || [];
    stackStack.push(H.getStackTrace());
    var ret = I.resultWrapper(data);
    //TODO: does it work? (not including `core` module here due to dependency error)
    //TODO: remove dependency on static named variable `H`
    if (H.debug) {
        C.find(data, function(val, key, list) {
            try {
                var r = fn(val, key, list);
                if (r) ret[key] = r;
                return callable(val, key, list);
            } catch (e) {
                e.printStackTrace('Nested error', stackStack);
            }
        });
    } else {
        C.find(data, function(val, key, list) {
            var r = fn(val, key, list);
            if (r) ret[key] = r;
            return callable(val, key, list);
        });
    }
    return ret;
};

/**
 * Iterate all keys on the object. (indices on arrays)
 * Would prefer H.each(H.keys())
 *
 * @static
 * @memberof H
 * @param {Array|Object} data data to iterate
 * @param {Function} callable iteratee to yield result
 */
I.eachKey = function(data, callable) {
    var keys = data;
    if (!Mini.isArrayLike(data)) {
        keys = C.keys(data);
    }
    var l = keys.length;
    var n = keys.length;
    for (l++; --l;) {
        callable(n - l, keys[n - l], data);
    }
};

/**
 * Iterate on a range of numbers.
 *
 * @static
 * @memberof H
 * @return {Array|Object}
 * @example
 *
 * H.eachIndex(4, function() {}) => 4x undefined
 * H.eachIndex(1, 4, function() {}) => 3x undefined
 * H.eachIndex(2, 4, 2, function() {}) => 1x undefined
 */
I.eachIndex = function() {
    var length = arguments.length;
    //accept 2-4 arguments only.
    if (length < 2 || length > 4) {
        return;
    }
    var start = length > 2 ? arguments[0] : 0;
    var end = length === 2 ? arguments[0] : arguments[1];
    var step = length >= 4 ? arguments[2] : 1;
    var iteratee = arguments[length - 1];

    //end, iteratee
    //start, end, iteratee
    //start, end, step, iteratee
    var rs = I.resultWrapper([]);
    var i = 0;

    if (step === 1) {
        //short for is faster than dowhile
        var ci = start;
        for (i = end - start + 1; --i;) {
            rs[ci] = iteratee(ci, ci);
            ci++;
        }
        return rs;
    } else {
        do {
            rs[start] = iteratee(start, i++);

            start += step;
        } while (start <= end);
        return rs;
    }
};

/**
 * Iterator discarding values.
 *
 * @param {Array|Object|Function} ele object to iterate
 * @param {Function} fn iteratee to produce values
 */
I.filter = function(ele, fn) {
    if (fn === undefined) {
        fn = ele;
        ele = this;
    }
    return I.each(ele, function(o) {
        if (fn(o)) {
            return o;
        }
    });
};

module.exports = I;