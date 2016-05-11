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
 * Register ResultSet process functions.
 *
 * @param {String} channel channel identifier
 * @param {String} name target function mount point
 * @param {Function} func Checker function. This provides ability of checking content validity to target functions.
 */
ARS.registerChannelFunction = function(channel, name, func) {
    /**
     * To avoid lodash internal error. (on Object.prototype)
     * (ResultSet member functions `filter`, `toArray` and so-on conflict with the lodash ver.)
     * @type {*|_.noop}
     */
    func.push = H.noop;
    Mini.arrayEach(ARS.checkTargets[channel] || [], function(target) {
        if (!target[name]) {
            H.addProperty(target, name, Mini.hiddenProperty(func));
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
        if (Mini.isArrayLike(obj) && typeof obj != 'string') {
            Mini.arrayEach(obj, function(son) {
                //if input is a string, will cause infinite loop
                if (son !== obj || typeof obj !== 'object') {
                    transformArray(son);
                }
            });
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