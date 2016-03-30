var _ = require('lodash/core');

var Detect = require('./detect');
var StackTrace = require('./stacktrace');

var C = {};

_.extend(C, _);
_.extend(C, Detect);
_.extend(C, StackTrace);

C._each = _.each;

/**
 * @deprecated
 */
C.QueryString = function(item){
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
    return svalue ? svalue[1] : svalue;
};

C.noop = function() {
    return function() {};
};

C.now = Date.now;

/*
 * jQuery Shim
 */
//noinspection JSUnresolvedVariable
if (C.root.jQuery) {
    //noinspection JSUnresolvedVariable
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

C.extend(String.prototype, {
    replaceAll: function(s1,s2){
        return this.replace(new RegExp(s1,"gm"),s2);
    }
});

C.getPrettyJson = function(jsonObject) {
    return JSON.stringify(jsonObject, null, "\t");
};

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

C.test = function(cb) {
    var o = C.now();
    cb();
    var d = C.now() - o;
    console.log(d);
    return d;
};

C.profile = function(cb, title) {
    console.profile(title || "Profile");
    var o = C.now();
    cb();
    var d = C.now() - o;
    //noinspection JSUnresolvedFunction
    console.profileEnd(title || "Profile");
    return d;
};

C.repeat = function(cb, times) {
    if (times > 0) {
        do {
            cb();
        } while(times--);
    }
};

C.testTimes = function(cb, times) {
    C.test(function() {
        C.repeat(cb, times);
    });
};

C.profileTimes = function(cb, times, title) {
    C.profile(function() {
        C.repeat(cb, times);
    }, title);
};

C.uuid = function (len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;

    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
};

C.fastUuid = function() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid[i] = '-';
        } else if (i === 14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
};

/*
 * Cef Interactions
 */
var cefQuery = C.root.cefQuery || function() {
        if (this.debug) console.log(arguments[0]);
    };

C.callCef = function(req, persistent, onsuccess, onfailure) {
    return cefQuery({
        request: req || "",
        persistent: !!persistent,
        onSuccess: onsuccess || function(response) {},
        onFailure: onfailure || function(err_code, err_msg) {}
    })
};

module.exports = C;