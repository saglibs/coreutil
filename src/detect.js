/*
 * Env Detection Module
 */

var C = {};

C.isArrayLike = require('lodash/isArrayLike');

/**
 * Check if a value can be parsed to an integer
 *
 * @static
 * @memberof H
 * @param {*} i value to be checked
 * @returns {boolean}
 */
C.isInteger = function(i) {
    return  /^-?\d+$/.test(i + "") || /^(-?\d+)e(\d+)$/.test(i + "");
};

/**
 * Checks if a value can be parsed into a float.
 *
 * @static
 * @memberof H
 * @param {*} v value to be checked
 * @returns {boolean}
 */
C.isFloat = function(v) {
    return /^(-?\d+)(\.\d+)?$/.test(v + "") || /^(-?\d+)(\.\d+)?e(-?\d+)$/.test(v + "");
};

var processObj = undefined;

try {
    processObj = eval('process');
} catch (e) {}

/**
 * Flag of is in node.js environment or not.
 *
 * @static
 * @memberof H
 * @type {boolean}
 */
C.isNodejs = 'object' === typeof processObj && Object.prototype.toString.call(processObj) === '[object process]';

C.root = {};

try {
    //noinspection JSUnresolvedVariable
    C.root = GLOBAL;
} catch (e) {
    C.root = window;
}

C.root.__catching = false;

C.__catching = false;

//noinspection JSUnresolvedVariable
// C.root = C.isNodejs ? GLOBAL : window;

//noinspection JSUnresolvedVariable
var root = C.root;

//noinspection JSUnresolvedVariable
root.navigator = root.navigator || {userAgent: ""};

C.root = root;

/**
 * Get IE version.
 * Returns 0 in non-IE environment.
 *
 * @static
 * @memberof H
 * @returns {number}
 */
C.getIE = function() {
    var MSIEs = navigator.userAgent.split('MSIE ')[1] || "0";
    var DNETs = navigator.userAgent.split('rv:')[1] || "0";

    MSIEs = MSIEs.split(".")[0];
    DNETs = DNETs.split(".")[0];

    var msie = ~~MSIEs;
    var dnet = ~~DNETs;

    if (msie != 0) {
        return msie;
    }
    if (dnet != 0) {
        return dnet;
    }

    return 0;
};

/**
 * Check if is in IE or is in a specified version of IE.
 *
 * @static
 * @memberof H
 * @param {Number} [v] version to check
 * @returns {boolean}
 */
C.isIE = function(v) {
    if (v !== undefined) {
        return C.getIE() == v;
    } else {
        return C.getIE() !== 0;
    }
};

/**
 * Flag of is in IE.
 *
 * @static
 * @memberof H
 * @type {boolean}
 */
C.likeIE = !!C.getIE();

/**
 * Flag of is in browsers on iPhone.
 *
 * @static
 * @memberof H
 * @type {boolean}
 */
C.isiPhone = navigator.userAgent.indexOf('iPhone') !== -1;

/**
 * Flag of is in browsers of Lollipop systems
 * @type {boolean}
 */
C.isLollipop = navigator.userAgent.indexOf('Android 5.') !== -1;

//root.hasOwnProperty shims
if (!root.hasOwnProperty) {
    root.hasOwnProperty = function(p) {
        //Note: in IE<9, p cannot be a function (for window)
        return !!root[p];
    };
}

/**
 * Check if canvas drawing is supported in current browser.
 *
 * @static
 * @memberof H
 * @returns {boolean}
 */
C.isCanvasSupported = function () {
    if (C.isNodejs) return false;
    var canvas = document.createElement('canvas');
    return root.hasOwnProperty("__cv") ? root.__cv : root.__cv = !!(canvas.getContext && canvas.getContext('2d'));
};

/**
 * Check if webgl drawing is supported in current browser.
 *
 * @static
 * @memberof H
 * @returns {boolean}
 */
C.isWebGLSupported = function () {
    if (C.isNodejs) return false;
    var canvas = document.createElement('canvas');
    return root.hasOwnProperty("__gl") ? root.__gl : root.__gl = !!(root['WebGLRenderingContext'] && canvas.getContext('webgl'));
};

C.isCanvasSupported();
C.isWebGLSupported();

/**
 * Language string
 *
 * @static
 * @memberof H
 * @type {string}
 */
C.language = C.isNodejs ? "" : (navigator.language || navigator['browserLanguage'] || "").toLowerCase();

module.exports = C;