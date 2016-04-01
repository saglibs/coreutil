/*
 * Object-Related Module
 *
 * TODO: to be doced
 */

var O = {};
require('./stacktrace');

//variable type to be checked
O.strContains = function(str, sub) {
    return str.indexOf(sub) !== -1;
};

O.strContainsIgnoreCase = function(str, sub) {
    return str.toLowerCase().indexOf(sub.toLowerCase()) !== -1;
};

O.parseJson = function(json) {
    try {
        return JSON.parse(decodeURI(json));
    } catch (e) {
        try {
            return JSON.parse(json);
        } catch (e) {
            e.printStackTrace();
        }
    }
    return undefined;
};

O.cloneByParse = function(obj) {
    //for small objects only
    return JSON.parse(JSON.stringify(obj));
};

module.exports = O;