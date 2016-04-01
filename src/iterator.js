/*
 * Iterator Logic Module
 */
var C = require('./core');

var I = function(template) {
    I.template = template || I.resultWrapper;
    return I;
};

/*
 * @private
 *
 * returns a template object for the input value
 */
I.resultWrapper = function(v) {
    if (I.template !== undefined) return I.template(v);
    return (v === undefined || v === null) ? {} : (C.isArrayLike(v) ? [] : {});
};

I.each = function(obj, fn, stackStack) {
    stackStack = stackStack || [];
    var ret = I.resultWrapper(obj);
    if (C.debug) {
        C._each(obj, function(val, key, list) {
            try {
                var r = fn(val, key, list);
                if (r) ret[key] = r;
            } catch (e) {
                e.printStackTrace('Nested error', stackStack);
            }
        });
    } else {
        C._each(obj, function(val, key, list) {
            var r = fn(val, key, list);
            if (r) ret[key] = r;
        });
    }
    return ret;
};

I.every = C._each;

I.until = function(data, fn, callable, stackStack) {
    stackStack = stackStack || [];
    var ret = I.resultWrapper(data);
    if (C.debug) {
        C.find(data, function(val, key, list) {
            try {
                var r = fn(val, key, list);
                if (r) ret[key] = r;
                return callable(val, key, list);
            } catch (e) {
                e.printStackTrace('Nested error', stackStack);
            }
        });
    } else {
        C.find(data, function(val, key, list) {
            var r = fn(val, key, list);
            if (r) ret[key] = r;
            return callable(val, key, list);
        });
    }
    return ret;
};

/*
 * Would prefer H.each(H.keys())
 */
I.eachKey = function(data, callable) {
    var keys = data;
    if (!C.isArrayLike(data)) {
        keys = C.keys(data);
    }
    var l = keys.length;
    var n = keys.length;
    for (l++; --l;) {
        callable(n - l, keys[n - l], data);
    }
};

I.eachIndex = function() {
    var length = arguments.length;
    //accept 2-4 arguments only.
    if (length < 2 || length > 4) {
        return;
    }
    var start = length > 2 ? arguments[0] : 0;
    var end = length === 2 ? arguments[0] : arguments[1];
    var step = length >= 4 ? arguments[2] : 1;
    var iteratee = arguments[length - 1];

    //end, iteratee
    //start, end, iteratee
    //start, end, step, iteratee
    var rs = I.resultWrapper();
    var i = 0;

    if (step === 1) {
        //short for is faster than dowhile
        var ci = start;
        for (i = end - start + 1; --i;) {
            rs[ci] = iteratee(ci, ci);
            ci++;
        }
        return rs;
    } else {
        do {
            rs[start] = iteratee(start, i++);

            start += step;
        } while (start <= end);
        return rs;
    }
};

I.filter = function(ele, fn) {
    if (fn === undefined) {
        fn = ele;
        ele = this;
    }
    return I.each(ele, function(o) {
        if (fn(o)) {
            return o;
        }
    });
};

module.exports = I;