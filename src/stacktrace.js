var C = {};

var Mini = require('./minicore');

var log = (console.error || console.log);

/**
 * Generate stack trace string. (separated by `\n`)
 *
 * @static
 * @memberof H
 * @param {String} [title]
 * @returns {string} stack trace string
 */
C.getStackTrace = function(title) {
    var callstack = "Referenced From: " + (title || "");
    var e = title instanceof Error ? title : new Error(callstack);
    var split = e.stack.split('\n');
    if (split.length > 1) {
        var t = split[0];
        //remove getStackTrace itself
        split.shift();
        split.shift();
        split.unshift(t);
        return split.join('\n');
    }
    return e.stack;
};

var DefaultNestedTitle = "Nested error:";
var DefaultTitle = "Error:";

/**
 * Print stack trace stack.
 *
 * @static
 * @memberof H
 * @param {String|Error} [title] title or error of current layer
 * @param {Array} [stackStack] stack trace stack (possibly)
 * @example
 *
 * usage:
 * H.printStackTrace(string/error, stackStack)
 * H.printStackTrace(string/error)
 * H.printStackTrace(stackStack)
 * H.printStackTrace()
 * variant:
 * error.printStackTrace() -> printStackTrace(error, [])
 */
C.printStackTrace = function(title, stackStack) {
    stackStack = stackStack || [];
    if (Mini.isArrayLike(title)) {
        //noinspection JSValidateTypes for arguments
        stackStack = title;
        if (stackStack.length) {
            title = DefaultNestedTitle;
        } else {
            title = DefaultTitle;
        }
    }
    title = title || DefaultTitle;
    stackStack.unshift(C.getStackTrace(title));
    var n = stackStack.length;
    var l = stackStack.length;
    for (l++; --l;) {
        log(stackStack[n - l]);
    }
};

/**
 * Print string with stack trace in debug mode.
 *
 * @static
 * @memberof H
 * @param {String|Error} [d] content to print
 * @param {Array} [stackTrace] stack trace stack
 */
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