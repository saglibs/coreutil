/*
 * Env Detection Module
 */

var C = {};

C.isArrayLike = require('lodash/isArrayLike');

C.isNodejs = 'object' === typeof eval('process') && Object.prototype.toString.call(eval('process')) === '[object process]';

C.root = {};

try {
    //noinspection JSUnresolvedVariable
    C.root = GLOBAL;
} catch (e) {
    C.root = window;
}

//noinspection JSUnresolvedVariable
// C.root = C.isNodejs ? GLOBAL : window;

//noinspection JSUnresolvedVariable
var root = C.root;

root.navigator = root.navigator || {userAgent: ""};

C.root = root;

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

C.isIE = function(v) {
    if (v !== undefined) {
        return C.getIE() == v;
    } else {
        return C.getIE() !== 0;
    }
};

C.likeIE = C.getIE();

C.isiPhone = navigator.userAgent.indexOf('iPhone') !== -1;

C.isLollipop = navigator.userAgent.indexOf('Android 5.') !== -1;

C.isCanvasSupported = function () {
    if (C.isNodejs) return false;
    var canvas = document.createElement('canvas');
    return root.hasOwnProperty("__cv") ? root.__cv : root.__cv = !!(canvas.getContext && canvas.getContext('2d'));
};

C.isWebGLSupported = function () {
    if (C.isNodejs) return false;
    var canvas = document.createElement('canvas');
    return root.hasOwnProperty("__gl") ? root.__gl : root.__gl = !!(root['WebGLRenderingContext'] && canvas.getContext('webgl'));
};

C.isCanvasSupported();
C.isWebGLSupported();

C.language = C.isNodejs ? "" : (navigator.language || navigator['browserLanguage'] || "").toLowerCase();

module.exports = C;