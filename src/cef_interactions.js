var C = require('./detect');

/*
 * Cef Interactions
 */
//noinspection JSUnresolvedVariable
var cefQuery = C.root.cefQuery || function() {
        if (this.debug) console.log(arguments[0]);
    };

/**
 * Call Cef
 *
 * @static
 * @memberof H
 * @param {string} [req] request string
 * @param {boolean} [persistent]
 * @param {Function} [onsuccess] success callback
 * @param {Function} [onfailure] failed callback
 * @returns {undefined}
 * @example
 *
 * H.callCef("selectItem:1", false, H.noop(), H.noop())
 */
C.callCef = function(req, persistent, onsuccess, onfailure) {
    return cefQuery({
        request: req || "",
        persistent: !!persistent,
        onSuccess: onsuccess || function(response) {},
        onFailure: onfailure || function(err_code, err_msg) {}
    })
};

module.exports = C;