/*
 * ResultSet Module
 */
var RS = {};
var Mini = require('../mini');
var H = require('lodash/core');
var ARS = require('./abstractresultset');

var RsIdentifier = '__isRS__';

function checker(val) {
    if (val instanceof Array || val instanceof Object) {
        return true;
    }
}

//default channel doesn't need filter
ARS.registerChannel(RsIdentifier, [Array.prototype, Object.prototype], checker);

ARS.registerChannelFunction('__isRS__', 'toArray', function(preChecker) {
    return function() {
        if (preChecker(this)) return H.values(this);
    };
});

function registerComponent(name, func) {
    ARS.registerChannelFunction(RsIdentifier, name, function(preCheck) {
        //r-w risky?
        checker = preCheck;
        return func;
    });
}

function wrapFunction(fn) {
    return function() {
        if (checker(arguments[0])) {
            fn.apply(this, arguments);
        }
    }
}

/*
 * ResultSet Operations
 */
function each() {
    //patch `fn`
    arguments[1] = wrapFunction(arguments[1]);
    return H.each.apply(H, [this].concat(Array.prototype.slice.call(arguments)));
}

function filter(fn) {
    fn = wrapFunction(fn);
    return H.each(this, function(o) {
        if (fn(o)) {
            return o;
        }
    });
}

function sortBy(fn) {
    fn = wrapFunction(fn);
    return H.sortBy(this, fn);
}

function toArray() {
    return H.values(this);
}

function groupBy(fn) {
    fn = wrapFunction(fn);
    return H.groupBy(this, fn);
}

function join(separator) {
    return H.values(this).join(separator || "");
}

function sum() {
    var s = 0;
    H.each(this || [], function(v) {
        var nv = H.isInteger(v) ? parseInt(v) : (H.isFloat(v) ? parseFloat(v) : NaN);
        if (!isNaN(nv)) {
            s += nv;
        }
    });
    return s;
}

function Length() {
    return H.values(this).length;
}

function values() {
    return H.values(this);
}

function keys() {
    return H.keys(this);
}

registerComponent("each",    each);
registerComponent("filter",  filter);
registerComponent("sortBy",  sortBy);
registerComponent("toArray", toArray);
registerComponent("groupBy", groupBy);
registerComponent("join",    join);
registerComponent("sum",     sum);
registerComponent("Length",  Length);
registerComponent("values",  values);
registerComponent("keys",    keys);

//assuming prototype exists
function transform(obj) {
    if (obj.prototype && obj.prototype.__Module__ && obj.prototype.__Module__ !== RsIdentifier) {
        obj.prototype.__Module__ = RsIdentifier;
    }
    if (obj.__proto__ && obj.__proto__.__Module__ && obj.__proto__.__Module__ !== RsIdentifier) {
        obj.__proto__.__Module__ = RsIdentifier;
    }
}

function transformArray(obj) {
    if (Mini.isArrayLike(obj)) {
        Mini.arrayEach(obj, transformArray);
    }
    transform(obj);
}

function wrap(v) {
    transformArray(v);
    return v;
}

RS.wrap = wrap;
/**
 * @deprecated
 * @type {wrap}
 */
RS.fastWrap = wrap;

module.exports = RS;