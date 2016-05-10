var H = require('../core');
/*
 * ResultSet Test
 */
var ARS = require('../src/main/javascript/abstractresultset');

ARS.registerChannel('__isRS__', [Array.prototype, Object.prototype], function(val) {
    if (val instanceof Array || val instanceof Object) {
        return true;
    }
});

ARS.registerChannelFunction('__isRS__', 'toArray', function(preChecker) {
    return function() {
        if (preChecker(this)) return H.values(this);
    };
});

var obj = {a: 1};
H.addProperty(obj, '__Module__', {
    value: '__RS__',
    configurable: false,
    enumerable: false,
    writable: true
});

console.log(obj.toArray());

/*
 * ResultSet Test
 */
var RS = require('../src/main/javascript/resultset');

RS.wrap({a: 1, b: 2}).each(function(v, k) {
    console.log(k);
    console.log(v);
});

/*
 * Iterator Test
 */
var I = require('../src/main/javascript/iterator');

I.each([1,2,3], function(i) {
    console.log(i);
});
