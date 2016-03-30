var C = {};

var log = (console.error || console.log);

C.getStackTrace = function(title) {
    var callstack = "Referenced From: " + (title || "");
    var e = title instanceof Error ? title : new Error(callstack);
    return e.stack;
};

C.printStackTrace = function(title, stackStack) {
    stackStack = (stackStack || []).unshift(C.getStackTrace(title));
    var n = stackStack.length;
    var l = stackStack.length;
    for (l++; --l;) {
        log(stackStack[n - l]);
    }
};

C.errlog = function(d, stackTrace) {
    if (C.debug) {
        C.printStackTrace(d);
        if (stackTrace && !C.isArrayLike(stackTrace)) {
            console.error("Referenced From: " + stackTrace);
        } else if (stackTrace && C.isArrayLike(stackTrace)) {
            for (var i = stackTrace.length - 1; i > -1; i--) {
                if (stackTrace[i]) console.error("Referenced From: " + stackTrace[i]);
            }
        }
    }
};

function printStackTrace(stackStack) {
    C.printStackTrace(this, stackStack);
}

Error.prototype.getStackTrace = C.getStackTrace;
Error.prototype.printStackTrace = printStackTrace;

module.exports = C;