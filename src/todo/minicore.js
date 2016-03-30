/*
 * MiniCore module
 *
 * provides shims for core abilities in core module
 */

var Mini = {};

var property = function(key) {
    return function(obj) {
        return obj == null ? void 0 : obj[key];
    };
};

// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var getLength = property('length');
var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
};

Mini.arrayContains = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = Mini.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return Mini.indexOf(obj, item, fromIndex) >= 0;
};

var nativeKeys = Object.keys;

var isFunction = function(obj) {
    return typeof (arguments.length === 0 ? this : obj) === 'function';
};

Mini.indexOf = function(arr, item, idx) {
    var keyArr = isArrayLike(arr) ? arr : Mini.keys(arr);
    if (typeof idx === 'undefined') {
        idx = 0;
    } else if (idx > keyArr.length) {
        return -1;
    }
    for (var i = idx; i < keyArr.length; i++) {
        if (keyArr[i] == item) {
            return i;
        }
    }
    return -1;
};

Mini.values = function(obj) {
    var keys = Mini.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = length + 1; --i;) {
        values[i - 1] = obj[keys[i - 1]];
    }
    return values;
};

var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPropertyOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (isFunction(constructor) && constructor.prototype) || Object.prototype;

    var prop = 'constructor';
    if (Mini.has(obj, prop) && !Mini.arrayContains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[prop] && !Mini.arrayContains(keys, prop)) {
            keys.push(prop);
        }
    }
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

Mini.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
};

//retrieve names of object's own properties
Mini.keys = function(obj, strict) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    //note: for-in in IE8 will iterate keys in a different sequence, comparing to chrome
    if (obj != null) for (var key in obj) if (hasOwnProperty.call(obj, key)) keys.push(key);
    if (hasEnumBug && strict) collectNonEnumProps(obj, keys);

    return keys;
};

Mini.each = function(object, iteratee, options, stackTraceStack) {
    if (object === undefined) {
        //WARN: log and errlog is SLOW due to accessing root.debug and printing out
        console.error('Iterating over undefined ', stackTraceStack);
        return;
    }

    var isarray = isArrayLike(object);
    var iterator = isarray ? [] : {};

    if (isarray) {
        var l = object.length;
        var cl = 0;
        //each: isarray has no noEmpty option cuz delete array[i] equals to a[i] = undefined
        for (l += 1; --l;) {
            iterator[cl] = iteratee(object[cl], cl, object, iterator);
            cl++;
        }
    } else {

        var keys = Mini.keys(object);
        var i = keys.length;
        var ki = 0, key;

        var it, ci = 0;
        for (i += 1; --i;) {
            it = keys[ci];
            ci++;
        }

        for (i = keys.length + 1; --i;) {
            key = keys[ki++];
            if (key) {
                iterator[key] = iteratee(object[key], key, object, iterator);
            }
        }
    }
    return iterator;
};

module.exports = Mini;