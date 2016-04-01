var C = {};

C.now = Date.now;

/**
 * Run a function, count the time consumed.
 *
 * @static
 * @memberof H
 * @param {Function} cb function to run
 * @returns {number} time in millis
 */
C.test = function(cb) {
    var o = C.now();
    cb();
    var d = C.now() - o;
    console.log(d);
    return d;
};

/**
 * Run a function, and record it in "Profile" tab in chromium.
 *
 * @static
 * @memberof H
 * @param {Function} cb function to run
 * @param {String} title title of this run
 * @returns {number} time in millis
 */
C.profile = function(cb, title) {
    console.profile(title || "Profile");
    var o = C.now();
    cb();
    var d = C.now() - o;
    //noinspection JSUnresolvedFunction
    console.profileEnd(title || "Profile");
    return d;
};

/**
 * Do something for some times
 *
 * @static
 * @memberof H
 * @param {Function} cb function to run
 * @param {Number} times times function will be executed
 */
C.repeat = function(cb, times) {
    if (times > 0) {
        do {
            cb();
        } while(times--);
    }
};

/**
 * Test some method and record the time consumption for several times.
 *
 * @static
 * @memberof H
 * @param {Function} cb function to run
 * @param {Number} times times function will be executed
 */
C.testTimes = function(cb, times) {
    C.test(function() {
        C.repeat(cb, times);
    });
};

/**
 * Profile some method for several times.
 *
 * @static
 * @memberof H
 * @param {Function} cb function to run
 * @param {Number} times times function will be executed
 * @param {String} title title of this run
 */
C.profileTimes = function(cb, times, title) {
    C.profile(function() {
        C.repeat(cb, times);
    }, title);
};

module.exports = C;