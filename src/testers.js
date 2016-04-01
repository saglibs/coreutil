var C = {};

C.now = Date.now;

C.test = function(cb) {
    var o = C.now();
    cb();
    var d = C.now() - o;
    console.log(d);
    return d;
};

C.profile = function(cb, title) {
    console.profile(title || "Profile");
    var o = C.now();
    cb();
    var d = C.now() - o;
    //noinspection JSUnresolvedFunction
    console.profileEnd(title || "Profile");
    return d;
};

C.repeat = function(cb, times) {
    if (times > 0) {
        do {
            cb();
        } while(times--);
    }
};

C.testTimes = function(cb, times) {
    C.test(function() {
        C.repeat(cb, times);
    });
};

C.profileTimes = function(cb, times, title) {
    C.profile(function() {
        C.repeat(cb, times);
    }, title);
};

module.exports = C;