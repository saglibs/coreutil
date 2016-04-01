var S = {};

var D = require('./detect');
var root = D.root;

var noop = function() {
    return function() {};
};

var navigator = D.root.navigator || {userAgent: ""};

//root.hasOwnProperty
if (!root.hasOwnProperty) {
    root.hasOwnProperty = function(p) {
        //Note: in IE<9, p cannot be a function (for window)
        return !!root[p];
    };
}

var addProperty = noop();
//defineProperty in IE8 only accepts DOM elements as parameters, while in Safari 5 it's opposite
if (!Object.defineProperty || (0 < D.getIE() <= 8 && navigator.userAgent.indexOf('MSIE') !== -1)) {
    addProperty = function(instance, k, descriptor) {
        instance[k] = descriptor.value;

        if (isObject(descriptor[k])) {
            instance[k].ienumerable = !descriptor.enumerable;
        } else {
            if (!instance[k].ienumerables) {
                instance[k].ienumerables = [];
            }
            if (!descriptor.enumerable && instance[k].ienumerables instanceof Array) {
                instance[k].ienumerables.push(k);
            } else if (instance['ienumerables']) {
                instance['ienumerables'][k] = undefined;
                delete instance['ienumerables'][k];
            }
        }

        //configurable, writable to be impl.
    };

    addProperty.__userDefined__ = true;

    if (!Object.defineProperty) Object.defineProperty = addProperty;
} else {
    addProperty = Object.defineProperty;
}

var createObject = function() {
    function F() {}

    return function(o, p) {
        F.prototype = o;
        var instance = new F();
        if (p) {
            //p is a descriptor with key name k
            //is this enough for replacing H.each(H.keys ?
            for (var k in p) {
                if (p.hasOwnProperty(k)) addProperty(instance, k, p[k]);
            }
        }
        return instance;
    };
}();

//emulate legacy getter/setter API using ES5 APIs
try {
    if (!Object.prototype.__defineGetter__ &&
        addProperty({},"x",{get: function(){return true;}}).x) {
        addProperty(Object.prototype, "__defineGetter__",
            {enumerable: false, configurable: true,
                value: function(name,func)
                {addProperty(this,name,
                    {get:func,enumerable: true,configurable: true});
                }});
        addProperty(Object.prototype, "__defineSetter__",
            {enumerable: false, configurable: true,
                value: function(name,func)
                {addProperty(this,name,
                    {set:func,enumerable: true,configurable: true});
                }});
    }
} catch(defPropException) {/*Do nothing if an exception occurs*/}

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = root.console || {};
    if (!root.console) root.console = console;

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

S.addProperty = addProperty;
S.createObject = createObject;

module.exports = S;