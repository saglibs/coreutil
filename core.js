var _ = require('lodash/core');

require('./src/raf');

var Detect = require('./src/detect');
var StackTrace = require('./src/stacktrace');
var ArrayBufferOp = require('./src/arraybuffer');
var CefInteractions = require('./src/cef_interactions');
var Maths = require('./src/math');
var Objects = require('./src/object');
var Storage = require('./src/storage');
var Tester = require('./src/testers');
var UrlUtils = require('./src/urlutils');
var Uuids = require('./src/uuid');
var Events = require('./src/event');
var Iterator = require('./src/iterator');
var Shims = require('./src/shims');
//TODO: resultset

var C = {};

_.extend(C, _);
_.extend(C, Detect);
_.extend(C, StackTrace);
_.extend(C, ArrayBufferOp);
_.extend(C, CefInteractions);
_.extend(C, Maths);
_.extend(C, Objects);
_.extend(C, Storage);
_.extend(C, Tester);
_.extend(C, UrlUtils);
_.extend(C, Uuids);
_.extend(C, Events);
_.extend(C, Iterator);
_.extend(C, Shims);

C.noop = function() {
    return function() {};
};

C.now = Date.now;

/*
 * jQuery Shim
 */
//noinspection JSUnresolvedVariable
if (C.root.jQuery) {
    //noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols
    C.root.jQuery.fn.extend({
        slideLeftHide: function( speed, callback ) {
            //noinspection JSUnresolvedFunction
            this.animate( {
                width: "hide",
                paddingLeft: "hide",
                paddingRight: "hide",
                marginLeft: "hide",
                marginRight: "hide"
            }, speed, callback);
        },
        slideLeftShow: function( speed, callback ) {
            //noinspection JSUnresolvedFunction
            this.animate( {
                width: "show",
                paddingLeft: "show",
                paddingRight: "show",
                marginLeft: "show",
                marginRight: "show"
            }, speed, callback);
        }
    });
}

//noinspection JSUnusedGlobalSymbols
C.extend(String.prototype, {
    replaceAll: function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    }
});

/**
 * Produce a random string in a fixed size. Output size is 16 by default.
 *
 * @static
 * @memberof H
 * @param {Number} [size] length of target string
 * @returns {string}
 */
C.nonceStr = function(size) {
    var s = "";
    var c = "0123456789qwertyuiopasdfghjklzxcvbnm";
    for (var i = 0; i < size || 16; i++) {
        s += c[parseInt(36 * Math.random())];
    }
    return s;
};

/**
 * Clear timer
 *
 * @static
 * @memberof H
 * @param timer timer to clear
 */
C.clearTimer = function(timer) {
    if (timer) {
        clearInterval(timer);
    }
};

module.exports = C;