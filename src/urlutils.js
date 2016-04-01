var C = {};

var I = require('./core');
var D = require('./detect');

var location = D.root.location || "";

C.QueryString = function(item){
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
    return svalue ? svalue[1] : svalue;
};

/**
 * @deprecated
 */
C.Request = {
    QueryString: C.QueryString
};

C.getUrlByParams =  function(server, action, params) {
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