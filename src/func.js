var C = {};

//shims
C.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

var after = function() {};

!(function() {
    var _funcs = {};
    after = function(func, times) {
        if (!(times > 0) && !(times < 0) && !(times === 0)) times = 1;
        if (!_funcs[func]) {
            _funcs[func] = times;
        }
        return function() {
            _funcs[func]--;
            if (_funcs[func] !== undefined && _funcs[func] <= 0) {
                _funcs[func] = undefined;
                return func();
            }
        };
    }
})();

C.after = after;

C.safeFunc = function(func) {
    return function() {
        if (func) return func.apply(this, arguments);
    };
};

module.exports = C;