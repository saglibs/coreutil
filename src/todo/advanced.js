/*
 * Advanced General Utils
 */

var A = {};
var I = require('./core');

A.getUrlByParams =  function(server, action, params) {
    var paramUrl = "";
    I.each(params, function(param, key) {
        paramUrl += "&" + key + "=";
        var p = "";
        if (param instanceof Array) {
            p = "[";
            var tr = "";
            I.each(param, function(val) {
                tr += ",";
                if (val instanceof Boolean ||
                    val instanceof String ||
                    val instanceof Number ||
                    typeof val === "string" ||
                    typeof val === "number") {
                    tr += "\"" + val + "\"";
                } else if (val) {
                    tr += val;
                }
            });
            p += tr.substr(1) + "]";
        } else {
            p = param;
        }
        paramUrl += p;
    });
    return (server + action + "?" + paramUrl.substr(1));
};

A.param = function(data) {
    var s = [], add = function(k, v) {
        s[s.length] = encodeURIComponent(k) + "=" + encodeURIComponent(v);
    };

    I.each(data, function(o, k) {
        add(k, o);
    });

    return s.join("&").replace(/%20/g, "+");
};

module.exports = A;