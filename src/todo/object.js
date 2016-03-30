/*
 * Object-Related Module
 */

var O = {};

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
    //for small pure object only. json is not good for big object
    return JSON.parse(JSON.stringify(obj));
};

module.exports = O;