var C = {};
var Error = require('./stacktrace');
var Detect = require('./detect');

if (Detect.isNodejs) {
    Detect.root.__sessionStorage = {};

    C.setItem = setItemFallback;
    C.getItem = getItemFallback;
    C.removeItem = removeItemFallback;
} else if (Detect.root.sessionStorage) try {
    sessionStorage.setItem('test', '1');
    sessionStorage.removeItem('test');

    C.setItem = function(key, value) {
        sessionStorage.removeItem(key);
        sessionStorage.setItem(key, value);
    };

    /**
     * @deprecated
     * @type {Function}
     */
    C.secAddItem = C.setItem;

    C.removeItem = function(key) {
        sessionStorage.removeItem(key);
    };

    C.getItem = function(key) {
        return sessionStorage.getItem(key);
    };

} catch (e) {
    Error.printStackTrace('Session Storage Not Supported');

    C.secAddItem = function(key, value) {
        setCookie(key, value, 1);
    };

    C.removeItem = function(key) {
        setCookie(key, null, 0);
    };

    C.getItem = function(key) {
        return getCookie(key);
    };
}

function setCookie(key, value, days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 86400000);
    document.cookie = key + "=" + value + "; expires=" + date.toUTCString();
}

function getCookie(key) {
    var regex = new RegExp('^\\s*' + key + '=');
    var splits = document.cookie.split(';');
    for (var i = 0; i < splits.length; i++) {
        var s = splits[i];
        var d = s.match(regex);
        if (d !== null && d.length !== 0) {
            return s.replace(regex, '');
        }
    }
}

function setItemFallback(key, value) {
    Detect.root.__sessionStorage[key] = value;
}

function getItemFallback(key) {
    return Detect.root.__sessionStorage[key];
}

function removeItemFallback(key) {
    Detect.root.__sessionStorage[key] = undefined;
}

module.exports = C;