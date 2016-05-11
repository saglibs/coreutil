var C = {};

var I = require('./iterator');
var D = require('./detect');

var location = D.root.location || "";

C.QueryString = function(item){
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
    return svalue ? svalue[1] : svalue;
};

/**
 * @static
 * @memberof H
 * @deprecated
 */
C.Request = {
    QueryString: C.QueryString
};

/**
 * Generate URL with GET param string
 *
 * @static
 * @memberof H
 * @param {String} server prefix string (domain)
 * @param {String} action path of file requests
 * @param {Object} params get param object
 * @returns {string} URL string
 * @example
 *
 * H.getUrlByParams("http://abc.def/", "path/of/file", {a: 1})
 * =>
 * "http://abc.def/path/of/file?a=1"
 */
C.getUrlByParams =  function(server, action, params) {
    var paramUrl = "";
    I.each(params || {}, function(param, key) {
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

/**
 * Generate simple param string from an object
 *
 * @static
 * @memberof H
 * @param {Object} data param object
 * @returns {string}
 * @example
 *
 * H.param({a:1, b:2})
 * =>
 * "a=1&b=2"
 */
C.param = function(data) {
    var s = [], add = function(k, v) {
        s[s.length] = encodeURIComponent(k) + "=" + encodeURIComponent(v);
    };

    I.each(data, function(o, k) {
        add(k, o);
    });

    return s.join("&").replace(/%20/g, "+");
};

module.exports = C;
