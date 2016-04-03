/*
 * ResultSet: Array or Element, they share the same filter/checker
 */

/**
 * Abstract ResultSet Module
 *
 * @static
 * @memberof H
 * @type {Object}
 */
var ARS = {};

var Mini = require('../mini');
var H = require('./shims');

ARS.modules = {};
ARS.checkTargets = {};
ARS.checkers = {};

var MODULE = '__Module__';

/**
 * Register a ResultSet channel
 * @param {String} identifier ResultSet channel identifier
 * @param {Array} targets ResultSet element prototypes, should always contains Array.prototype
 * @param {Function} valuePrechecker value validity prechecker function
 */
ARS.registerChannel = function(identifier, targets, valuePrechecker) {
    ARS.modules[identifier] = {};
    ARS.checkTargets[identifier] = targets;
    ARS.checkers[identifier] = valuePrechecker;

    Mini.arrayEach(targets || [], function(target) {
        if (!target[MODULE]) {
            H.addProperty(target, MODULE, Mini.hiddenProperty(MODULE));
        }
    });
};

/**
 * Inner preCheck function. used to check validity of values
 *
 * @param {*} object value to check
 * @returns {boolean}
 */
function preCheck(object) {
    return !!(ARS.checkers[object[MODULE] || ""] || function() {})(object);
}

/**
 * Register ResultSet process functions.
 *
 * TODO: integrate ResultSet.registerComponent into this function (maybe some dependency injection?)
 *
 * @param {String} channel channel identifier
 * @param {String} name target function mount point
 * @param {Function} funcGen function generator, which produces a function with checker
 * function injected. This provides ability of checking content validity to target functions.
 */
ARS.registerChannelFunction = function(channel, name, funcGen) {
    Mini.arrayEach(ARS.checkTargets[channel] || [], function(target) {
        if (target[name]) {
            //exist, do nothing. cuz preChecker is relative to current module
        } else {
            //not exist, add func to target
            // target[name] = funcGen(ARS.checkers[channel]);
            H.addProperty(target, name, Mini.hiddenProperty(funcGen(preCheck)));
        }
    });
};

/**
 * Wrapper function generator.
 *
 * @param {String} identifier channel identifier
 * @returns {wrap} wrapper function to wrap any value into specific ResultSet form
 */
ARS.wrapperGen = function(identifier) {
    //assuming prototype exists
    function transform(obj) {
        if (obj.prototype && obj.prototype.__Module__ && obj.prototype.__Module__ !== identifier) {
            obj.prototype.__Module__ = identifier;
        }
        if (obj.__proto__ && obj.__proto__.__Module__ && obj.__proto__.__Module__ !== identifier) {
            obj.__proto__.__Module__ = identifier;
        }
    }

    function transformArray(obj) {
        if (Mini.isArrayLike(obj)) {
            Mini.arrayEach(obj, transformArray);
        }
        transform(obj, identifier);
    }

    /**
     * Wrap an object to ResultSet
     *
     * @static
     * @param {Array|Object} v anything to wrap
     * @returns {*} wrapped ResultSet object
     */
    function wrap(v) {
        transformArray(v);
        return v;
    }

    return wrap;
};

module.exports = ARS;