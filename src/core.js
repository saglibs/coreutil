var _ = require('lodash/core');

require('./raf');

var Detect = require('./detect');
var StackTrace = require('./stacktrace');
var ArrayBufferOp = require('./arraybuffer');
var CefInteractions = require('./cef_interactions');
var Maths = require('./math');
var Objects = require('./object');
var Storage = require('./storage');
var Tester = require('./testers');
var UrlUtils = require('./urlutils');
var Uuids = require('./uuid');
var Events = require('./event');
var Iterator = require('./iterator');
var Shims = require('./shims');
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

C.nonceStr = function() {
    var s = "";
    var c = "0123456789qwertyuiopasdfghjklzxcvbnm";
    for (var i = 0; i < 16; i++) {
        s += c[parseInt(36 * Math.random())];
    }
    return s;
};

C.clearTimer = function(timer) {
    if (timer) {
        clearInterval(timer);
    }
};

module.exports = C;