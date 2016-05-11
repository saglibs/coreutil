var extend = require('lodash/extend');

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
// var Iterator = require('./iterator');
var Shims = require('./shims');
var ARS = require('./abstractresultset');
var RS = require('./resultset');
var Func = require('./func');

module.exports = function(base) {

    var C = {
        extend: extend
    };

    C.__isRoot__ = true;

    extend(C, base || {});
    extend(C, Detect);
    extend(C, StackTrace);
    extend(C, ArrayBufferOp);
    extend(C, CefInteractions);
    extend(C, Maths);
    extend(C, Objects);
    extend(C, Storage);
    extend(C, Tester);
    extend(C, UrlUtils);
    extend(C, Uuids);
    extend(C, Events);
// _.extend(C, Iterator);
    extend(C, Shims);
    extend(C, RS);
    extend(C, Func);

    C.abstraceResultSet = ARS;

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

    return C;
};
