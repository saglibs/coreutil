var C = {};

var Mini = require('../mini');

function InformError() {
    this.message = "Inform Error Catchers";
    this.name = "InformError";
    this.stack = new Error(this.name).stack;
}

InformError.prototype = Error.prototype;

C.InformError = InformError;

var clog = function (content) {
    console.error(content);
    //throw a simple error to inform catchers, eval(someone is catching)
    if (eval('__catching')) {
        throw new InformError("Nested Error");
    }
};

var logStack = function(stackStack) {
    var joined = [];
    Mini.arrayEach(stackStack || [], function(stack) {
        if (typeof stack == 'string') {
            joined = joined.concat(stack.split("\n"));
        } else if (stack instanceof Error) {
            joined = joined.concat(stack.stack.split("\n"));
        }
    });
    if (joined.length != 0) {
        var ret = joined[0];
        for (var i = 1; i < joined.length; i++) {
            ret += "\n" + joined[i];
        }
        clog.apply(this, [ret]);
    }
};

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
        // split.unshift(callstack);
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
 * @param {boolean} [silient] the current error should be silent
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
C.printStackTrace = function(title, stackStack, silient) {
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
    stackStack = stackStack || [];
    if (!Mini.isArrayLike(stackStack) || typeof stackStack == 'string') {
        stackStack = [stackStack];
    }
    if (!silient) stackStack.unshift(C.getStackTrace(title));
    logStack.call(this, stackStack);
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