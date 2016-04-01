var C = require('./detect');

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